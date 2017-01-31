/**
 * CLI view operations (create, destroy)
 */
'use strict';

// Module dependencies
var fs        = require('fs-extra'),
    path      = require('path'),
    cmd       = require('child_process'),
    utils     = require('./utils'),
    templates = require('./file-templates');

// Module utilities
var success  = utils.success,
    //error    = utils.error,
    indent   = utils.indent;

module.exports = {

    //
    errors: [],

    //
    start: function (callback) {
        var setup = this,
            checks = ['copyjs', 'installjs', 'copycss', 'buildjs', 'copyPhpIncludes', 'copyPhpIndex', 'updatePhpHeader'],
            steps = [],
            // Determine if all checks have run by evaluating the length of the complete array
            isComplete = function () {
                var isComplete = false;

                if (steps.length === checks.length) {
                    isComplete = true;
                }

                return isComplete;
            },
            //
            isJsReady = function () {
                var isJsCopied = (steps.indexOf('copyjs') > -1),
                    isJsInstalled = (steps.indexOf('installjs') > -1),
                    isCssCopied = (steps.indexOf('copycss') > -1);

                return (isJsCopied && isJsInstalled && isCssCopied);
            },
            // Finish a potentially async step by pushing its value to the complete array.
            // If all steps have completed then execute the callback.
            finishStep = function (type) {
                steps.push(type);
                if (isComplete()) {
                    if (setup.errors.length) {
                        callback(setup.errors);
                    } else {
                        callback();
                    }
                } else if (isJsReady()) {
                    setup.buildJs(finishStep);
                }
            };

        success('Initializating LAMPjs sub-project...');
        setup.copyJs(finishStep); // Calls NPM install when finished
        setup.copyCss(finishStep);
        setup.copyPhpIncludes(finishStep);
        setup.copyPhpIndex(finishStep);
        setup.updatePhpHeader(finishStep);
    },

    //
    copyJs: function (complete) {
        var setup = this,
            sourcePath = __dirname + '/setup/js',
            destPath = path.resolve('./');

        fs.copy(sourcePath, destPath, function (err) {
            if (err) {
                setup.errors.push(err);
            } else {
                setup.installJs(destPath, complete);
            }
            complete('copyjs');
        });
    },

    //
    installJs: function (destDir, complete) {
        var setup = this;

        cmd.exec('npm cache clean && npm install', { cwd: destDir }, function (err, stdout, stderr) {
            if (err) {
                setup.errors.push(err);
            } else if (stderr) {
                setup.errors.push(stderr);
            }
            fs.renameSync(destDir + '/.npmignore', destDir + '/.gitignore');
            complete('installjs');
        });
    },

    //
    copyCss: function (complete) {
        var setup = this,
            sourcePath = __dirname + '/setup/css',
            destPath = path.resolve('../css');

        fs.copy(sourcePath, destPath, function (err) {
            if (err) {
                setup.errors.push(err);
            }
            complete('copycss');
        });
    },

    //
    copyPhpIncludes: function (complete) {
        var setup = this,
            sourcePath = __dirname + '/setup/includes',
            destPath = path.resolve('../includes'),
            todoCnt = 0,
            completeCnt = 0;

        fs.readdir(sourcePath, function (err, files) {
            todoCnt = files.length;

            if (todoCnt) {
                files.forEach(function (filename) {
                    if (filename.indexOf('.php') > -1) {
                        fs.copy(sourcePath + '/' + filename, destPath + '/' + filename, function (err) {
                            if (err) {
                                setup.errors.push(err);
                            }
                            completeCnt += 1;
                            if (completeCnt === todoCnt) {
                                complete('copyPhpIncludes');
                            }
                        });

                    }
                });
            } else {
                complete('copyPhpIncludes');
            }
        });
    },

    //
    copyPhpIndex: function (complete) {
        var setup = this,
            sourcePath = __dirname + '/setup/index.php',
            destPath = path.resolve('../index.php');

        fs.copy(sourcePath, destPath, function (err) {
            if (err) {
                setup.errors.push(err);
            }
            complete('copyPhpIndex');
        });
    },

    //
    updatePhpHeader: function (complete) {
        var headTemplate = templates.phpHtmlHeadGlobal,
            fileLines,
            insertLine;

        // Read the file as an array
        fileLines = fs.readFileSync('../framework/local/HTMLHeadGlobal.php').toString().split('\n');
        // Find the insert line and comment out any existing settings
        fileLines.forEach(function (line, index) {
            if (line.indexOf('parent::__construct();') > -1) {
                insertLine = index;
            } else if (line.match(/appendHtmlContent\(\'<meta|appendCSSFile|basePageTitle/) !== null) {
                fileLines[index] = '//' + line;
            }
        });
        // Set the insert value
        headTemplate = fileLines[insertLine] + '\n' + indent(8) + headTemplate;
        // Update the insert line
        fileLines.splice(insertLine, 1, headTemplate);
        // Re-join the file code together
        fileLines = fileLines.join('\n');
        // Update the router file
        fs.writeFileSync('../framework/local/HTMLHeadGlobal.php', fileLines);
        complete('updatePhpHeader');
    },

    //
    buildJs: function (complete) {
        var setup = this,
            cwd = path.resolve('./');

        cmd.exec('grunt build', { cwd: cwd }, function (err, stdout, stderr) {
            if (err) {
                setup.errors.push(err);
            } else if (stderr) {
                setup.errors.push(stderr);
            }
            complete('buildjs');
        });
    },


};

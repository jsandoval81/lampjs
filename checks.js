/**
 * Checks/validations required by CLI operations.
 */
'use strict';

// Module dependencies
var fs        = require('fs'),
    path      = require('path'),
    esprima   = require('esprima'),
    utils     = require('./utils');

// Module utilities
var error    = utils.error,
    warning  = utils.warning;

/**
 * (Private)
 * Parse the framework router file code to produce the list of route definitions.
 * This is very file/framework-specific and would need to be updated if the format of the
 * router is ever updated.
 * @param  {string} routerCode [the actual code contents of the app router file]
 * @return {Array[string]} [the esprima-parsed code block declarations of the router cases]
 */
var getCodeRoutes = function (routerCode) {
    var routes;

    esprima.parse(routerCode, { loc: true }).body[0].expression.right.callee.body.body.forEach(function (dec) {
        if (dec.type === 'VariableDeclaration' && dec.declarations[0].id.name === 'getRoutes') {
            dec.declarations[0].init.body.body.forEach(function (block) {
                if (block.type === 'ReturnStatement' && block.argument.properties[0].key.name === 'all') {
                    routes = block.argument.properties[0].value.elements;
                }
            });
        }
    });

    return routes;
};

/**
 * (Private)
 * Get the route code declaration from the app router.
 * Also includes meta info about the router file, such as where to edit.
 * @param  {string} fileData
 * @param  {string} path
 * @return {Object} route
 */
var getRoute = function (fileData, path) {
    var routes = getCodeRoutes(fileData),
        route = { exists: false },
        keepUpdatingLine = true;

    // Iterate the esprima-parsed router delcarations (case statements)
    routes.forEach(function (currentRoute) {
        // Track the line/column edit locations in the router file
        if (keepUpdatingLine) {
            route.insertLine = currentRoute.loc.end.line;
            route.insertColumn = currentRoute.loc.start.column;
            route.removeLine = currentRoute.loc.start.line;
        }

        // If we found the route then flag that it exists.
        if (currentRoute.properties[0].value.value.toLowerCase() === path.toLowerCase()) {
            route.exists = true;
            keepUpdatingLine = false;
        }
    });

    return route;
};

module.exports = {

    /**
     * (Public)
     * Check if the command should return the help doc
     * @param  {string} command
     * @return {Boolean}
     */
    isHelp: function (command) {
        return (!command || command.match(/^help|\-help|\-h$/));
    },

    /**
     * (Public)
     * Check if the command should return the version info
     * @param  {string} command
     * @return {Boolean}
     */
    isVersion: function (command) {
        return (command.match(/^version|\-version|\-v$/));
    },

    /**
     * (Public)
     * Check if the command should run the project init
     * @param  {string} command
     * @return {Boolean}
     */
    isProjectInit: function (command) {
        return (command.match(/^init$/));
    },

    /**
     * (Public)
     * Check if the project init is in a valid directory
     * @return {Boolean}
     */
    isProjectInitDir: function () {
        return (path.resolve('./').split('/').pop() === 'js');
    },

    /**
     * (Public)
     * Check if the directory is an NPM project directory
     * @param {Function} callback
     */
    npmProjectDir: function (callback) {
        fs.open('package.json', 'r', function (err) {
            if (typeof callback === 'function') {
                callback(err);
            }
        });
    },

    /**
     * (Public)
     * Validate the input params to the CLI commands
     * @param  {string} command
     * @param  {string} type
     * @param  {string} name
     * @param  {string} path
     * @return {Boolean} isValid
     */
    params: function (command, type, name, path) {
        var isValid = false;

        if (command) {
            if (command.match(/^create|destroy$/i)) {
                if (type) {
                    if (type.match(/^view$/)) {
                        if (name) {
                            if (path) {
                                isValid = true;
                            } else {
                                error('Please specify a path for the ' + type + ' to ' + command);
                            }
                        } else {
                            error('Please specify a name for the ' + type + ' to ' + command);
                        }
                    } else {
                        error('Unknown type: ' + type);
                    }
                } else {
                    warning('Show help for ' + command, true);
                }
            } else {
                error('Unknown command: ' + command);
            }
        } else {
            warning('Show Help or version or something', true);
        }

        return isValid;

    },

    /**
     * (Public)
     * Examine the state of the file system prior to executing the CLI request.
     * For instance, each operation (create, destroy) may wish to behave differently
     * based on whether certain files and directories already exist.
     * @param  {string} command
     * @param  {string} type
     * @param  {string} name
     * @param  {string} path
     * @param  {Function} callback
     */
    fileSystem: function (command, type, name, path, callback) {
        var checks = {
                viewExists: false,
                templateExists: false,
                styleExists: false,
                routeExists: false,
                phpFolderExists: false,
                phpIndexExists: false,
            },
            checkStatus = [],
            routeDef,
            // Determine if all checks have run by evaluating the length of the complete array
            isComplete = function () {
                var isComplete = false;

                if (checkStatus.length === Object.keys(checks).length) {
                    isComplete = true;
                }

                return isComplete;
            },
            // Finish a potentially async step by pushing its value to the complete array.
            // If all steps have completed then execute the callback.
            finishCheck = function (type) {
                checkStatus.push(type);
                if (isComplete()) {
                    callback(checks, routeDef);
                }
            };

        //////////////////////////
        // Check if view exists //
        //////////////////////////
        fs.open('./src/app/' + type + 's/' + name + '/' + name + '.js', 'r', function (err) {
            if (!err) {
                checks.viewExists = true;
            }
            finishCheck('view');
        });
        //////////////////////////////
        // Check if template exists //
        //////////////////////////////
        fs.open('./src/app/' + type + 's/' + name + '/' + name + '.hbs', 'r', function (err) {
            if (!err) {
                checks.templateExists = true;
            }
            finishCheck('template');
        });
        /////////////////////////////////////
        // Check if LESS stylesheet exists //
        /////////////////////////////////////
        fs.open('../css/less/application/' + name + '.less', 'r', function (err) {
            if (!err) {
                checks.styleExists = true;
            }
            finishCheck('style');
        });
        ////////////////////////////////
        // Check if route code exists //
        ////////////////////////////////
        fs.open('./src/app/router.js', 'r', function (err) {
            if (!err) {
                fs.readFile('./src/app/router.js', 'utf8', function (err, data) {
                    if (!err) {
                        routeDef = getRoute(data, path);
                        checks.routeExists = routeDef.exists;
                        finishCheck('route');
                    }
                });
            }
        });
        //////////////////////////////////////
        // Check if PHP route folder exists //
        //////////////////////////////////////
        fs.open('../' + path + '/', 'r', function (err) {
            if (!err) {
                checks.phpFolderExists = true;
            }
            finishCheck('phpDir');
        });
        //////////////////////////////////////////
        // Check if PHP route index file exists //
        //////////////////////////////////////////
        fs.open('../' + path + '/index.php', 'r', function (err) {
            if (!err) {
                checks.phpIndexExists = true;
            }
            finishCheck('phpIndex');
        });

    },

};

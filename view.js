/**
 * CLI view operations (create, destroy)
 */
'use strict';

// Module dependencies
var fs        = require('fs'),
    templates = require('./file-templates'),
    utils     = require('./utils');

// Module utilities
var error    = utils.error,
    indent   = utils.indent,
    camelize = utils.camelize;

module.exports = {

    /**
     * (Public)
     * Create a framework view, including the template, stylesheet, php framework
     * folders and files, and also create the route code within the router.
     * @param  {string}   name     [skeleton-case view name]
     * @param  {string}   path     [URL relative route path]
     * @param  {Object}   checks   [which files/folders already exist]
     * @param  {Object}   route    [Info about the route to be added]
     * @param  {Function} callback
     */
    create: function (name, path, checks, route, callback) {
        var isValid = true,
            messages = '',
            steps = [],
            fileLines,
            // Determine if all checks have run by evaluating the length of the complete array
            isComplete = function () {
                var isComplete = false;

                if (steps.length === Object.keys(checks).length) {
                    isComplete = true;
                }

                return isComplete;
            },
            // Finish a potentially async step by pushing its value to the complete array.
            // If all steps have completed then execute the callback.
            finishStep = function (type) {
                steps.push(type);
                if (isComplete()) {
                    callback();
                }
            };

        // Make sure none of the filesystem objects already exists
        Object.keys(checks).forEach(function (check) {
            var checkName = check.replace('Exists', '');

            if (checks[check]) {
                isValid = false;
                messages += '\n- ' + checkName + ' already exists';
            }
        });

        if (!isValid) {
            messages = 'Could not create view:' + messages;
            error(messages);
        } else {
            //////////////////
            // Create Route //
            //////////////////
            // This updates the actual code of the router.js file.
            var routeTemplate = templates.route;
            // Prep the route code to insert
            routeTemplate = routeTemplate.replace('@@path@@', path);
            routeTemplate = routeTemplate.replace('@@view@@', camelize(name));
            routeTemplate = routeTemplate.replace(/\@\@indent\@\@/ig, indent(route.insertColumn));
            // Split the router file
            fileLines = fs.readFileSync('./src/app/router.js').toString().split('\n');
            // Append the existing insert line to the end of the new code
            routeTemplate += fileLines[route.insertLine];
            // Update the code line in the parsed array
            fileLines.splice(route.insertLine, 1, indent(route.insertColumn) + routeTemplate);
            // Re-join the file code together
            fileLines = fileLines.join('\n');
            // Update the router file
            fs.writeFileSync('./src/app/router.js', fileLines);
            finishStep('router');

            /////////////////
            // Create View //
            /////////////////
            var viewTemplate = templates.view;
            viewTemplate = viewTemplate.replace('@@module@@', camelize(name));
            viewTemplate = viewTemplate.replace('@@template@@', name);
            fs.mkdirSync('./src/app/views/' + name + '/');
            fs.writeFileSync('./src/app/views/' + name + '/' + name + '.js', viewTemplate, { flag: 'wx' });
            finishStep('view');

            /////////////////////
            // Create Template //
            /////////////////////
            var handlebarsTemplate = templates.handlebars;
            handlebarsTemplate = handlebarsTemplate.replace('@@display@@', name);
            fs.writeFileSync('./src/app/views/' + name + '/' + name + '.hbs', handlebarsTemplate, { flag: 'wx' });
            finishStep('template');

            ///////////////////////
            // Create Stylesheet //
            ///////////////////////
            var lessTemplate = templates.less;
            lessTemplate = lessTemplate.replace('@@container@@', name);
            fs.writeFileSync('../css/less/application/' + name + '.less', lessTemplate, { flag: 'wx' });
            finishStep('style');

            //////////////////////////
            // Create PHP Route Dir //
            //////////////////////////
            fs.mkdirSync('../' + path + '/');
            finishStep('phpDir');

            ////////////////////////////
            // Create PHP Route Index //
            ////////////////////////////
            var phpTemplate = templates.php;
            fs.writeFileSync('../' + path + '/index.php', phpTemplate, { flag: 'wx' });
            finishStep('phpIndex');
        }

    },

    /**
     * (Public)
     * Delete a framework view, including the template, stylesheet, php framework
     * folders and files, and also remove the route code within the router.
     * @param  {string}   name     [skeleton-case view name]
     * @param  {string}   path     [URL relative route path]
     * @param  {Object}   checks   [which files/folders already exist]
     * @param  {Object}   route    [Info about the route to be removed]
     * @param  {Function} callback
     */
    destroy: function (name, path, checks, route, callback) {
        var isValid = false,
            messages = '',
            steps = [],
            fileLines,
            removeViewFolder = false,
            // Determine if all checks have run by evaluating the length of the complete array
            isComplete = function () {
                var isComplete = false;

                if (steps.length === Object.keys(checks).length) {
                    isComplete = true;
                }

                return isComplete;
            },
            // Finish a potentially async step by pushing its value to the complete array.
            // If all steps have completed then execute the callback.
            finishStep = function (type) {
                steps.push(type);
                if (isComplete()) {
                    callback();
                }
            };

        // Make sure at least one file or folder needs to be removed
        Object.keys(checks).forEach(function (check) {
            if (checks[check]) {
                isValid = true;
            }
        });

        if (!isValid) {
            messages = 'Could not destroy view: No objects found';
            error(messages);
        } else {
            //////////////////
            // Delete Route //
            //////////////////
            if (checks.routeExists) {
                // This updates the actual code of the router.js file.
                // Split the router file
                fileLines = fs.readFileSync('./src/app/router.js').toString().split('\n');
                // Remove the code lines in the parsed array
                fileLines.splice(route.removeLine - 1, 3);
                // Re-join the file code together
                fileLines = fileLines.join('\n');
                // Update the router file
                fs.writeFileSync('./src/app/router.js', fileLines);
            }
            finishStep('router');

            //////////////////
            // Destroy View //
            //////////////////
            if (checks.viewExists) {
                fs.unlinkSync('./src/app/views/' + name + '/' + name + '.js');
                removeViewFolder = true;
            }

            //////////////////////
            // Destroy Template //
            //////////////////////
            if (checks.templateExists) {
                fs.unlinkSync('./src/app/views/' + name + '/' + name + '.hbs');
                removeViewFolder = true;
            }

            //////////////////////////////////
            // Destroy View/Template Folder //
            //////////////////////////////////
            if (removeViewFolder) {
                fs.rmdirSync('./src/app/views/' + name + '/');
            }
            finishStep('view');
            finishStep('template');

            ////////////////////////
            // Destroy Stylesheet //
            ////////////////////////
            if (checks.styleExists) {
                fs.unlinkSync('../css/less/application/' + name + '.less');
            }
            finishStep('style');

            /////////////////////////////
            // Destroy PHP Route Index //
            /////////////////////////////
            if (checks.phpIndexExists) {
                fs.unlinkSync('../' + path + '/index.php');
            }
            finishStep('phpIndex');

            ///////////////////////////
            // Destroy PHP Route Dir //
            ///////////////////////////
            if (checks.phpFolderExists) {
                fs.rmdirSync('../' + path + '/');
            }
            finishStep('phpDir');
        }
    },

};

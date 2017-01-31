#!/usr/bin/env node

/**
 * LampJS CLI initializer.
 *
 * The LampJS CLI allows for the programatic creation of framework concepts, such as views.
 * A view in the framework may consist of several files and directories, and there may be some
 * desired templates or defaults. This CLI is intended to save time over having to create all of
 * the file system elements by hand.
 */
'use strict';

// Module dependencies
var check = require('./checks'),
    view  = require('./view'),
    utils = require('./utils'),
    projectInit = require('./project-init');

// Module utilities
var success = utils.success,
    error   = utils.error;

// CLI inputs
var params  = process.argv,
    command = (params[2]) ? params[2].toLowerCase() : null,
    type    = (params[3]) ? params[3].toLowerCase() : null,
    name    = (params[4]) ? params[4].toLowerCase() : null,
    path    = params[5];

/**
 * (Private)
 * Project initialization routine.
 * Checks the project directory before starting the project-init module routines.
 */
var initProject = function () {
    if (!check.isProjectInitDir()) {
        error('Please init from the /js directory of the PHP project');
    } else {
        utils.showBanner();
        projectInit.start(function (err) {
            if (err && err.length) {
                error('The following errors occured:', false);
                err.forEach(function (errMsg) {
                    error(errMsg);
                });
            } else {
                success('Initialization complete!');
            }
        });
    }
};

/**
 * (Private)
 * Project update routine.
 * Checks the validity of the input params and file system conditions before
 * calling to execute to create/destroy views.
 */
var updateProject = function () {

    if (check.params(command, type, name, path)) {
        check.npmProjectDir(function (err) {
            if (err) {
                error('Not an NPM project directory!');
            } else {
                // Begin processing
                utils.showBanner();
                check.fileSystem(command, type, name, path, function (checks, route) {
                    // Operations
                    if (command === 'create' && type === 'view') {
                        view.create(name, path, checks, route, function () {
                            success('Successfully created view "' + name + '" for URL path ' + path);
                            success('Please restart your grunt task if necessary');
                        });
                    } else if (command === 'destroy' && type === 'view') {
                        view.destroy(name, path, checks, route, function () {
                            success('Successfully removed view "' + name + '" for URL path ' + path);
                            success('Please restart your grunt task if necessary');
                        });
                    } else {
                        console.log('TODO: ' + command + ' ' + type + ' with name ' + name);
                    }
                });
            }
        });
    } else {
        error('Invalid command paramters. See lampjs -help.');
    }
};

/**
 * Entry routine.
 *
 * Check what type of command was sent and call the appropriate routine.
 */
if (check.isHelp(command)) {
    // Show help
    utils.showHelp();
} else if (check.isVersion(command)) {
    // Show version number
    utils.showVersion();
} else if (check.isProjectInit(command)) {
    // Initialize project
    initProject();
} else {
    // Create/destroy project views
    updateProject();
}

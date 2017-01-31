/**
 * CLI generic utility methods
 */
'use strict';

// Module dependencies
var clear     = require('clear'),
    chalk     = require('chalk'),
    templates = require('./file-templates'),
    info      = require('./package.json');

module.exports = {

    /**
     * (Public)
     * Show the CLI console banner
     */
    showBanner: function () {
        clear();
        console.log(chalk.yellow(templates.banner));
        console.log('');
    },

    /**
     * (Public)
     * Show the CLI help
     */
    showHelp: function () {
        this.showBanner();
        console.log(templates.cliHelp);
        console.log('');
        process.exit();
    },

    /**
     * (Public)
     * Show the CLI version
     */
    showVersion: function () {
        this.showBanner();
        console.log(chalk.magenta('LAMPjs: ' + info.version));
        console.log('');
        process.exit();
    },

    /**
     * (Public)
     * Output success messages to the CLI console
     * @param {string} message
     */
    success: function (message) {
        var displayMessage = message || 'Success!';

        console.log(chalk.green(displayMessage));
        console.log('');
    },

    /**
     * (Public)
     * Output error messages to the CLI console.
     * Exits the current CLI process.
     * @param {string} message
     */
    error: function (message, shouldExit) {
        var displayMessage = message || 'Unknown error';

        console.log(chalk.red(displayMessage));
        console.log('');
        if (shouldExit !== false) {
            process.exit();
        }
    },

    /**
     * (Public)
     * Output success messages to the CLI console.
     * Accepts extra parameter in case the warning should also exist the current CLI process.
     * @param {string} message
     * @param {Boolean} shouldExit
     */
    warning: function (message, shouldExit) {
        var displayMessage = message || 'Warning/Help';

        console.log(chalk.yellow(displayMessage));
        if (shouldExit) {
            console.log('');
            process.exit();
        }
    },

    /**
     * (Public)
     * Return a string of spaces.
     * Helpful for correctly indenting the code templates.
     * @param  {Number} count
     * @return {string} indent
     */
    indent: function (count) {
        var i,
            indent = '';

        for (i = 1; i <= count; i += 1) {
            indent += ' ';
        }

        return indent;
    },

    /**
     * (Public)
     * Turn a skeleton-case string into camel-case.
     * @param  {string} str
     * @return {string}
     */
    camelize: function (str) {
        return str.toLowerCase().replace(/-(.)/g, function(match, group1) {
            return group1.toUpperCase();
        });
    },

};

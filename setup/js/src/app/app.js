/**
 * @copyright 2016 InspiringApps
 * @link http://www.inspiringapps.com
 *
 **********************
 * Development Toolset
 **********************
 * The JS app runs within an NPM app using Grunt to automate development.
 * Refer to the repo README for getting up and running with the automation tools.
 * There are no NPM dependencies for production - only development automation.
 * Any external libraries are stored in /src/libs and manually included in the Gruntfile build.
 *
 * The Gruntfile.js defines the module build order, as well as other automated tasks like
 * linting, concatenation, LESS pre-processing, etc.
 * /

/**
 * App global
 * @return {Object}
 */
var app = {
    // Support contact phone number
    customerSupportPhone: '',
    // Support contact email
    customerSupportEmail: '',
    // Persistent DOM selector cache
    domCache: {}
};

/**
* @copyright 2016 InspiringApps
* @link http://www.inspiringapps.com
*
* Build custom Handlebars helpers
*
* @return {Object}
*/
app.pageInit = (function () {
    'use strict';

    /***********************/
    /* Module dependencies */
    /***********************/
    //var appUtils = app.appUtils;

    // Return the current year
    Handlebars.registerHelper('currentYear', function () {
        return moment().format('YYYY');
    });

    /**
     * Date Formatting
     */
    Handlebars.registerHelper('weekdate', function (options) {
        return moment(options.fn(this)).format('MMMM Do, YYYY');
    });

})();

/**
* @copyright 2016 InspiringApps
* @link http://www.inspiringapps.com
*
* Synchronous router to handle script loading and view rendering based on URI path.
* Meant to suppliment the IA PHP framework.
*
* @return {Object}
*/
app.syncRouter = (function () {
    'use strict';

    /***********************/
    /* Module dependencies */
    /***********************/
    var appUtils = app.appUtils,
        pageInit = app.pageInit;

    /**************************/
    /* Private module methods */
    /**************************/
    /**
     * (Private)
     * Common template rendering routine
     * @param {Function} template
     * @param {Object} [data]
     * @param {Function} [instanceRender]
     * @param {Function} [error]
     */
    var renderTemplate = function (template, data, instanceRender, error) {

        // If we have a template to render
        if (appUtils.hasFunction(template) && appUtils.hasObject(data)) {
            instanceRender(template, data, pageInit);
        } else if (appUtils.hasFunction(error)) {
            error();
        }
    };

    /**************************/
    /* Public/Exposed methods */
    /**************************/
    return function (config) {
        var empty = function () {},
            hasConfig = appUtils.hasObject(config),
            getView = (hasConfig && appUtils.hasFunction(config.getView)) ? config.getView : empty,
            instanceRender = (hasConfig && appUtils.hasFunction(config.renderTemplate)) ? config.renderTemplate : empty,
            instanceRouteError = (hasConfig && appUtils.hasFunction(config.routeError)) ? config.routeError : empty,
            instanceRenderError = (hasConfig && appUtils.hasFunction(config.renderError)) ? config.renderError : empty;

        return {
            /**
             * (Public)
             * Initialize the JS view module that corresponds to the route path
             * @param {string} url
             */
            route: function (url) {
                var router = this,
                    path = urlSplit(url).path,
                    view = getView(path);

                // If we have a route initializer method to run
                if (appUtils.hasObject(view)) {
                    view.init();
                } else {
                    // Otherwise error
                    router.routeError();
                }
            },

            /**
             * (Public)
             * Handle route errors
             */
            routeError: function () {
                // Call the instance router routine
                instanceRouteError();

                // @TODO:
                console.warn('No route initializer');
            },

            /**
             * (Public)
             * Render the view template
             * @param  {Function} templateName
             * @param  {Object} [data]
             */
            render: function (templateName, data) {
                var router = this,
                    template;

                // Make sure the pageInit dependency is properly attached
                if (!pageInit) {
                    pageInit = app.pageInit;
                }

                // If we have a template name
                if (appUtils.hasString(templateName)) {
                    template = app.Templates[templateName];

                    // Make sure a data object is present
                    if (!appUtils.hasObject(data)) {
                        data = {};
                    }

                    // Render the template
                    renderTemplate(template, data, instanceRender, router.renderError);
                } else {
                    router.renderError();
                }
            },

            /**
             * (Public)
             * Handle render errors
             */
            renderError: function () {
                // Call the instance router routine
                instanceRenderError();

                // @TODO
                console.warn('No template');
            },

        };

    };

})();

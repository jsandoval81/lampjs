/*
* @copyright 2016 InspiringApps
* @link http://www.inspiringapps.com
*
* An instance of the synchronous router class to handle script loading and
* view rendering based on URI path. Meant to suppliment the IA PHP framework.
*
* @return {Object}
*/
app.router = (function () {
    'use strict';

    /***********************/
    /* Module dependencies */
    /***********************/



    /**************************/
    /* Private module methods */
    /**************************/
    /**
     * App Route Definition
     * @return {Object}
     */
    var getRoutes = function () {
        return {
            all: [
                {
                    path: '/',
                    view: app.homeSignedOut
                },
            ],
            static: function () {
                return this.all.filter(function (route) {
                    return (route.path.indexOf('/*/') === -1);
                });
            },
            dynamic: function () {
                return this.all.filter(function (route) {
                    return (route.path.indexOf('/*/') !== -1);
                });
            }
        };
    };

    /**
     * (Private)
     * Get the view object based on the url path
     * @param  {string} path [url path]
     * @return {Object} view
     */
    var getView = function (path) {
        var pathSegments = path.split('/'),
            routes = getRoutes(),
            view;

        // Try static paths first
        routes.static().forEach(function (route) {
            if (route.path === path) {
                view = route.view;
            }
        });

        if (!view) {
            // Otherwise try dynamic-segment paths
            routes.dynamic().forEach(function (route) {
                var routePathSegments = route.path.split('/'),
                    match;

                if (routePathSegments.length === pathSegments.length) {
                    routePathSegments.forEach(function (routeSegment, idx) {
                        if (routeSegment !== '*') {
                            if (routeSegment !== pathSegments[idx]) {
                                match = false;
                            }
                        }
                    });
                    if (match !== false) {
                        view = route.view;
                    }
                }
            });
        }

        return view;
    };

    /**************************/
    /* Public/Exposed methods */
    /**************************/
    return new app.syncRouter({
        // Router hook method for returning the view object based on the url path
        getView: getView,

        // Router hook for app-specific rendering routine
        renderTemplate: function (template, data, pageInit) {
            // Hide loading messages and render the template content
            $('.main-loading').hide(0);
            $('.app').prepend(template(data));

            // Initialize common page functionality
            pageInit.initializeMobileMenu();
            pageInit.initializeModalActions();
        },

    });

})();

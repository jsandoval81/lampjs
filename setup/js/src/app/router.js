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
     * (Private)
     * Get the view object based on the url path
     * @param  {string} path [url path]
     * @return {Object} view
     */
    var getView = function (path) {
        var view;

        switch (path) {
            case '/':
                view = app.homeSignedOut;
                break;
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

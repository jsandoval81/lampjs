/**
* @copyright 2016 InspiringApps
* @link http://www.inspiringapps.com
*
* Public (unauthenticated) home page
*
* @return {Object}
*/
app.homeSignedOut = (function () {
    'use strict';

    /***********************/
    /* Module dependencies */
    /***********************/
    var dataUtils = app.dataUtils,
        dom = app.domCache;

    /**************************/
    /* Private module methods */
    /**************************/
    // Images to prefetch
    var prefetchedImages = [];

    /**
     * (Private)
     * Template data fetch
     * @param {Object} pageData [container object to populate]
     * @param {Function} resume [callback]
     */
    var getData = function (pageData, resume) {

        $.getJSON('/js/src/app/sample-data-local.json')
            .done(function (response) {
                pageData.appHeaderData = response.appHeaderData;

                if (prefetchedImages.length) {
                    dataUtils.prefetchImages(prefetchedImages, resume);
                } else {
                    resume();
                }
            });
    };

    /**************************/
    /* Public/Exposed methods */
    /**************************/
    return new app.View({
        // View hook for setting the template name
        templateName: 'home-signed-out',

        // View hook for caching DOM selectors
        cacheDomSelectors: function () {
            dom.$appHeader = $('.app-header'); // @TODO
        },

        // View hook for fetching pre-render data
        getData: getData,

        // View hook for executing post-render operations
        afterRender: function () {
            //initializeSlideshows();
        },
    });

})();

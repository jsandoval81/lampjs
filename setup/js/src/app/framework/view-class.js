/**
* @copyright 2016 InspiringApps
* @link http://www.inspiringapps.com
*
* Base view class
*
* @return {Object}
*/
app.View = (function () {
    'use strict';

    /***********************/
    /* Module dependencies */
    /***********************/
    var appUtils = app.appUtils,
        router = app.router,
        dom = app.domCache;

    /**************************/
    /* Private module methods */
    /**************************/
    /**
     * (Private)
     * Get any data required before rendering the view template.
     * @param {Object} pageData [view data storage object to populate]
     * @param {Function} instanceGetData [instance data fetch routine]
     * @param {Function} done
     */
    var getPageloadData = function (pageData, instanceGetData, done) {
        var isSuccessful = true,
            complete = function () {
                if (appUtils.hasFunction(done)) {
                    // Execute the callback
                    done(isSuccessful);
                }
            };

        // If the pageData storage reference was passed
        if (appUtils.hasObject(pageData)) {
            // Execute the instance data fetch
            instanceGetData(pageData, complete);
        } else {
            // Otherwise fail
            isSuccessful = false;
            complete();
        }
    };

    /**
     * (Private)
     * Cache the DOM selectors on the view to avoid re-querying the DOM tree
     * @param {Function} instanceSelectors
     */
    var cacheDomSelectors = function (instanceSelectors) {
        // Cache global selectors
        dom.$appHeader = $('.app-header');
        dom.$appFooter = $('footer');
        // Cache instance selectors
        instanceSelectors(dom);
    };

    /**************************/
    /* Public/Exposed methods */
    /**************************/
    return function (config) {
        // Set the instance properties (and fallbacks)
        var empty = function () {},
            hasConfig = appUtils.hasObject(config),
            instanceTemplateName = (hasConfig && appUtils.hasString(config.templateName)) ? config.templateName : '',
            instanceInit = (hasConfig && appUtils.hasFunction(config.init)) ? config.init : empty,
            instanceGetData = (hasConfig && appUtils.hasFunction(config.getData)) ? config.getData : null,
            instanceBeforeRender = (hasConfig && appUtils.hasFunction(config.beforeRender)) ? config.beforeRender : empty,
            instanceAfterRender = (hasConfig && appUtils.hasFunction(config.afterRender)) ? config.afterRender : empty,
            instanceSelectors = (hasConfig && appUtils.hasFunction(config.cacheDomSelectors)) ? config.cacheDomSelectors : empty;

        return {
            // Handlebars template name
            templateName: instanceTemplateName,

            // Page data object (initial)
            pageData: {},

            /**
             * (Public)
             * View initializer
             */
            init: function () {
                var view = this;

                // Run instance routines
                instanceInit(view);
                // Run pre-render operations
                view.beforeRender(function (isSuccessful) {
                    if (isSuccessful) {
                        if (appUtils.hasString(view.templateName)) {
                            // Render the template
                            router.render(view.templateName, view.pageData);
                            // Run post-render operations
                            view.afterRender();
                        } else {
                            // @TODO
                            console.warn('no template specified');
                        }
                    } else {
                        // @TODO
                        console.warn('error during pre-render operations');
                    }
                });
            },

            /**
             * (Public)
             * View pre-render operations
             * @param {Function} done
             */
            beforeRender: function (done) {
                var view = this,
                    afterData = function (isSuccessful) {
                        if (isSuccessful) {
                            if (appUtils.hasFunction(done)) {
                                done(isSuccessful);
                            }
                        } else {
                            // @TODO
                            console.warn('error during initial data fetch');
                        }
                    };

                // Run instance routines
                instanceBeforeRender();
                if (instanceGetData) {
                    // Add initial page data to the view pageData object.
                    // Send a callback to be executed when complete.
                    getPageloadData(view.pageData, instanceGetData, afterData);
                } else {
                    done(true);
                }
            },

            /**
             * (Public)
             * View post-render operations.
             */
            afterRender: function () {
                // Cache DOM selectors from this class and instance
                cacheDomSelectors(instanceSelectors);
                // Execute instance method
                instanceAfterRender(dom);
            },
        };

    };

})();

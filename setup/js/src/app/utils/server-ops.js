/**
 * @copyright 2016 InspiringApps
 * @link http://www.inspiringapps.com
 *
 * Handle server API calls.
 *
 * Public methods for generating API call config object and convenience AJAX methods.
 *
 * Private methods ensure call stability and protect the actual AJAX API call routine.
 *
 * @return {Object}
 */
app.server = (function () {
    'use strict';

    /***********************/
    /* Module dependencies */
    /***********************/
    var appUtils = app.appUtils;

    /************************/
    /* Module Configuration */
    /************************/
    var defaults = {
        // The default SENT data format and encoding
        ajaxContentType: 'application/json; charset=utf-8',
        // The default RECEIVED data expected format
        ajaxDataType: 'json',
        // The default send failure error message
        ajaxSendErrorMessage: 'Error sending request to server',
        // The default received failure error message
        ajaxReceivedErrorMessage: 'Error in response from server',
        // The default overlay progress message
        ajaxProgressMessage: 'Loading...'
    };

    /**************************/
    /* Private module methods */
    /**************************/
    /**
     * (Private)
     * Set the contentType (sent) on the apiConfig object.
     * If a valid contentType is already set then take no action.
     * Otherwise set a default.
     * @param {Object} apiConfig
     */
    var setContentType = function (apiConfig) {
        switch (apiConfig.contentType) {
            // Valid content types (intentional fallthrough)
            case 'application/x-www-form-urlencoded; charset=utf-8':
            case 'multipart/form-data':
            case 'text/plain':
            case 'application/json; charset=utf-8':
                // Do nothing
                break;
            default:
                // Otherwise set default
                apiConfig.contentType = defaults.ajaxContentType;
                break;
        }
    };

    /**
     * (Private)
     * Set the dataType (recieved) on the apiConfig object.
     * If a valid dataType is already set then take no action.
     * Otherwise set a default.
     * @param {Object} apiConfig
     */
    var setDataType = function (apiConfig) {
        switch (apiConfig.dataType) {
            // Valid data types (intentional fallthrough)
            case 'xml':
            case 'html':
            case 'json':
                // Do nothing
                break;
            default:
                // Otherwise set default
                apiConfig.dataType = defaults.ajaxDataType;
                break;
        }
    };

    /**
     * (Private)
     * Utility method to call a common API request complete routine.
     * Tasks like executing async callbacks and handling errors are done here.
     * @param {Boolean} isRequestSuccessful
     * @param {string} error
     * @param {Function} callback
     */
    var requestComplete = function (isRequestSuccessful, error, callback) {
        var errorMessage = defaults.ajaxReceivedErrorMessage;

        // Execute the optional callback (which can hide the overlay when ready)
        if (appUtils.hasFunction(callback)) {
            callback(isRequestSuccessful);
        } else {
            // Otherwise hide the UI loading overlay
            appUtils.hideOverlay();
        }
        // Handle any errors
        if (isRequestSuccessful === false) {
            // Update the error message
            if (error) {
                errorMessage = '<p><code>Error: ' + error.toString() +'</code></p>';
            }
            // Display the error modal
            //appUtils.openErrorModal(errorMessage);
        }
    };

    /**
     * (Private)
     * Check to see if the config object that was sent to apiCall() is valid,
     * at least enough to send an AJAX request.
     * @param  {Object} config
     * @return {Boolean} isValid
     */
    var isAPIConfigValid = function (config) {
        var isValid = false;

        if (appUtils.hasObject(config)) {
            if (appUtils.hasString(config.url) && appUtils.hasString(config.httpMethod)) {
                isValid = true;
            }
        }

        return isValid;
    };

    /**
     * (Private)
     * AJAX routine for server API calls. Called with a config object that decorates
     * the ajax properties and callbacks.
     *
     * This routine handles its own request errors through the general error modal by always calling the
     * requestComplete() function with error params. The requestComplete() function also runs any callbacks
     * that were passed in to this module from the event handler. It also hides any open loading overlays.
     *
     * If the invoking method needs to perform additional actions upon done/fail/always, like specific cleanup,
     * then that is what those config hooks are for.
     *
     * @param {Object}   config
     * @param {string}   [config.overlayText]
     * @param {Number}   [config.overlaySpeed]
     * @param {string}   config.url
     * @param {string}   config.httpMethod
     * @param {string}   [config.data]
     * @param {string}   [config.contentType]
     * @param {string}   [config.dataType]
     * @param {Function} [config.done]
     * @param {Function} [config.fail]
     * @param {Function} [config.always]
     * @param {Function} [config.callback]
     */
    var apiCall = function (config) {
        var isRequestSuccessful,
            error;

        // Show the loading overlay then begin the server request
        // (If we don't wait then the animation of the overlay can become choppy depending
        // on the speed/cost of processing the server request)
        appUtils.showOverlay(config.overlayText, config.overlaySpeed).done(function () {
            // If the config param is valid enough to complete the AJAX call
            if (isAPIConfigValid(config)) {
                // Set/validate the content (sent) and data (received) types
                setContentType(config);
                setDataType(config);

                // Make async server call
                $.ajax({
                    url: config.url,
                    method: config.httpMethod,
                    data: config.data,
                    contentType: config.contentType,
                    dataType: config.dataType
                })  // Success
                    .done(function (response) {
                        isRequestSuccessful = true;
                        if (appUtils.hasFunction(config.done)) {
                            config.done(response);
                        }
                    })
                    // Failure
                    .fail(function (response) {
                        isRequestSuccessful = false;
                        error = (response.responseText) ? JSON.parse(response.responseText).errors : null;
                        if (appUtils.hasFunction(config.fail)) {
                            config.fail(response);
                        }
                    })
                    // Always
                    .always(function (/*response*/) {
                        requestComplete(isRequestSuccessful, error, config.callback);
                        if (appUtils.hasFunction(config.always)) {
                            config.always(isRequestSuccessful);
                        }
                    });
            } else {
                // Otherwise set fail params
                isRequestSuccessful = false;
                error = defaults.ajaxSendErrorMessage;
                // Complete the failed request
                if (appUtils.hasObject(config)) {
                    requestComplete(isRequestSuccessful, error, config.callback);
                } else {
                    requestComplete(isRequestSuccessful, error);
                }
            }
        });
    };

    /**************************/
    /* Public/Exposed methods */
    /**************************/
    return {
        /**
         * (Public)
         * Generate an API-call config object. Set any optional properties as requested.
         * Note: Default values in this method may need to be updated on a per-application basis.
         * @param {Object} [config]
         * @return {Object} apiConfig
         */
        getApiConfig: function (config) {
            var apiConfig = {
                    overlayText: defaults.ajaxProgressMessage,
                    overlaySpeed: 'default',
                    url: '/',
                    httpMethod: 'GET',
                    data: null,
                    contentType: defaults.ajaxContentType,
                    dataType: defaults.ajaxDataType,
                    done: null,
                    fail: null,
                    always: null,
                    callback: null
                };

            // If a config object was passed then set any relevant properties
            if (appUtils.hasObject(config)) {
                if (appUtils.hasString(config.overlayText)) {
                    apiConfig.overlayText = config.overlayText;
                }
                if (appUtils.hasString(config.url)) {
                    apiConfig.url = config.url;
                }
                if (appUtils.hasString(config.httpMethod) && config.httpMethod.match(/^(GET|POST|PUT|DELETE|OPTIONS|PATCH)$/i)) {
                    apiConfig.httpMethod = config.httpMethod.toUpperCase();
                }
                if (appUtils.hasString(config.data) || appUtils.hasObject(config.data)) {
                    if (appUtils.hasObject(config.data)) {
                        apiConfig.data = JSON.stringify(config.data);
                    } else {
                        apiConfig.data = config.data;
                    }
                }
                if (appUtils.hasString(config.contentType)) {
                    apiConfig.contentType = config.contentType;
                }
                if (appUtils.hasString(config.dataType)) {
                    apiConfig.dataType = config.dataType;
                }
                if (appUtils.hasFunction(config.done)) {
                    apiConfig.done = config.done;
                }
                if (appUtils.hasFunction(config.fail)) {
                    apiConfig.fail = config.fail;
                }
                if (appUtils.hasFunction(config.always)) {
                    apiConfig.always = config.always;
                }
                if (appUtils.hasFunction(config.callback)) {
                    apiConfig.callback = config.callback;
                }
            }

            return apiConfig;
        },

        /**
         * (Public)
         * Convenience method for passing through an API call configuration as a GET
         * @param {Object} config
         * @param {Function} [callback]
         */
        get: function (config, callback) {
            if (appUtils.hasObject(config) && config.url) {
                config.httpMethod = 'GET';
                config.callback = callback;
                apiCall(config);
            } else {
                requestComplete(false, defaults.ajaxSendErrorMessage, callback);
            }
        },

        /**
         * (Public)
         * Convenience method for passing through an API call configuration as a POST
         * @param {Object} config
         * @param {Function} [callback]
         */
        post: function (config, callback) {
            if (appUtils.hasObject(config) && config.url && config.data) {
                config.httpMethod = 'POST';
                config.callback = callback;
                apiCall(config);
            } else {
                requestComplete(false, defaults.ajaxSendErrorMessage, callback);
            }
        },

        /**
         * (Public)
         * Convenience method for passing through an API call configuration as a PUT
         * @param {Object} config
         * @param {Function} [callback]
         */
        put: function (config, callback) {
            if (appUtils.hasObject(config) && config.url && config.data) {
                config.httpMethod = 'PUT';
                config.callback = callback;
                apiCall(config);
            } else {
                requestComplete(false, defaults.ajaxSendErrorMessage, callback);
            }
        },

        /**
         * (Public)
         * Convenience method for passing through an API call configuration as a DELETE
         * @param {Object} config
         * @param {Function} [callback]
         */
        delete: function (config, callback) {
            if (appUtils.hasObject(config) && config.url) {
                config.httpMethod = 'DELETE';
                config.callback = callback;
                apiCall(config);
            } else {
                requestComplete(false, defaults.ajaxSendErrorMessage, callback);
            }
        },

    };

})();

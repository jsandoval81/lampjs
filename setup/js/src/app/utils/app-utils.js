/**
 * @copyright 2016 InspiringApps
 * @link http://www.inspiringapps.com
 *
 * Utility module that creates app functionality utility methods (e.g. modal display, debounce, etc.)
 *
 * @return {Object}
 */

/**************************/
/* Custom utility methods */
/**************************/
app.appUtils = (function () {
    'use strict';

    /**************************/
    /* Private module methods */
    /**************************/
    /**
     * (Private)
     * Get the width in pixels of the browser scrollbar. Used to
     * dynamically set the compensating padding-right whenever overflow
     * is disabled;
     * @return {string} scrollbarWidth
     */
    var getScrollbarWidth = function () {
        var scrollDiv,
            scrollbarWidth;

        // Create an element to measure the scrollbar
        scrollDiv = document.createElement('div');
        scrollDiv.className = 'scrollbar-measure';
        document.body.appendChild(scrollDiv);

        // Get the scrollbar width
        scrollbarWidth = (scrollDiv.offsetWidth - scrollDiv.clientWidth) + 'px';
        //console.warn(scrollbarWidth);

        // Delete the measurement element
        document.body.removeChild(scrollDiv);

        // Return the scrollbar width
        return scrollbarWidth;
    };

    /**
     * (Private)
     * Freeze the page from scrolling, such as behind certain modals
     */
    var freezePageScroll = function () {
        $('body').addClass('modal-open');
        $('body, .app-header, .report-header').css('padding-right', getScrollbarWidth());
    };

    /**
     * (Private)
     * Unfreeze the page scroll-lock, such as behind certain modals
     */
    var unfreezePageScroll = function () {
        $('body').removeClass('modal-open');
        $('body, .app-header, .report-header').css('padding-right', '');
    };

    /**************************/
    /* Public/Exposed methods */
    /**************************/
    return {
        /*********************/
        /* Generic Utilities */
        /*********************/
        /**
         * (Public)
         * Utility debounce method
         * @param  {Function} func     [function to debounce]
         * @param  {Number} wait       [delay in ms]
         * @param  {Boolean} immediate [front-side exec]
         * @return {Function}
         */
        debounce: function (func, wait, immediate) {
            var timeout;

            return function () {
                var context = this, args = arguments,
                    later = function() {
                        timeout = null;
                        if (!immediate) {
                            func.apply(context, args);
                        }
                    },
                    callNow = immediate && !timeout;

                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) {
                    func.apply(context, args);
                }
            };
        },

        /**
         * Return whether environment is local dev
         * @return {Boolean}
         */
        isLocalEnv: function () {
            return (window.location.href.search(/local\-|localhost/) > -1);
        },

        // Variable Type Tests (basic)
        //
        // Loose typing in JS means these are just high-level helpers.
        // True "is..." methods would be more rigourous.
        //
        // Lodash 4 core is down to something like 4KB gzipped, so we should look
        // that direction if we want more (and agree with their identification rules).
        // https://github.com/lodash/lodash/wiki/build-differences
        hasString: function (value) {
            return (value && typeof value === 'string');
        },
        hasNumber: function (value) {
            return (typeof value === 'number');
        },
        hasBoolean: function (value) {
            return (typeof value === 'boolean');
        },
        hasObject: function (value) {
            return (value && typeof value === 'object');
        },
        hasArray: function (value) {
            return (value && Array.isArray(value));
        },
        hasFunction: function (value) {
            return (value && typeof value === 'function');
        },

        // Custom combos
        hasStringOrNumber: function (value) {
            return (this.hasString(value) || this.hasNumber(value));
        },
        hasStringOrBoolean: function (value) {
            return (this.hasString(value) || this.hasBoolean(value));
        },

        /*******************/
        /* Modals/Overlays */
        /*******************/
        /**
         * (Public)
         * Open the requested modal element
         * @param {string} name [CSS/jQuery selector]
         */
        openModal: function (name) {
            var fadeDuration = 400;

            // Freeze scrolling behind the modal
            freezePageScroll();

            // Show the modal
            $(name).fadeIn(fadeDuration);
            $('.modal-mask').fadeIn(fadeDuration);
        },

        /**
         * (Public)
         * Close the requested modal element
         * @param {string} name [CSS/jQuery selector]
         */
        closeModal: function (name, callback) {
            var fadeDuration = 400;

            // Hide the modal
            $('.modal-mask').fadeOut(fadeDuration);
            $(name).fadeOut(fadeDuration, function () {
                // Unfreeze scrolling behind the modal
                unfreezePageScroll();

                // Execute any custom callbacks
                if (callback && typeof callback === 'function') {
                    callback();
                }
            });
        },

        /**
         * (Public)
         * Show the error modal with an error message param.
         * Error message can contain HTML.
         * @param {string} errorMessage
         */
        openErrorModal: function (errorMessage) {
            var appUtils = this,
                displayMessage = (appUtils.hasString(errorMessage)) ? errorMessage : 'Unknown Error';

            // Update the text in the error modal UI
            $('.general-error-modal .error-message').html(displayMessage);

            // Show the error modal
            appUtils.openModal('.general-error-modal');
        },

        /**
         * (Public)
         * Show the footer overlay. Return a promise that can be resolved by the caller.
         * @param  {string} text
         * @param  {Number} speed
         * @return {Promise}
         */
        showOverlay: function (text, speed) {
            var $loadingOverlayMask = $('.loading-overlay-mask'),
                displaySpeed = (typeof speed === 'number' && speed >= 0) ? speed : 700;

            return $loadingOverlayMask.fadeIn(displaySpeed).promise();
        },

        /**
         * (Public)
         * Hide the footer overlay
         * @param {Number} speed
         */
        hideOverlay: function (speed) {
            var $loadingOverlayMask = $('.loading-overlay-mask'),
                displaySpeed = (typeof speed === 'number' && speed >= 0) ? speed : 700;

            // Set the hide animation at the end of the current call stack
            setTimeout(function () {
                $loadingOverlayMask.fadeOut(displaySpeed);
            }, 0);
        },

        /*************/
        /* Scrolling */
        /*************/
        /**
         * (Public)
         * Smooth scroll to a page element with an ID that matches the href
         * of the clicked element.
         * @param {Object} event
         */
        pageJumpSmoothScroll: function (event) {
            var targetHref = $(this).prop('href'),
                targetElement = targetHref.substr(targetHref.lastIndexOf('#'), targetHref.length);

            $(window).scrollTo(targetElement, 600, { offset: -175 });

            event.preventDefault();
        }

    };

})();

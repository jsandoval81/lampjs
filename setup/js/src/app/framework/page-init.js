/**
* @copyright 2016 InspiringApps
* @link http://www.inspiringapps.com
*
* Page initialization methods - mostly adding and responding to event listeners.
*
* The pageInit methods should be called only once the DOM is ready.
* There is a DOM-ready hook at the bottom of this module that makes those calls.
*
* @return {Object}
*/
app.pageInit = (function () {
    'use strict';

    /***********************/
    /* Module dependencies */
    /***********************/
    var appUtils = app.appUtils;

    /**************************/
    /* Private module methods */
    /**************************/
    /**
     * (Private)
     * Event-scoped method for toggling the mobile version of the nav menu
     * @param {Object} [event]
     */
    var toggleNav = function (/*event*/) {
        var $menu = $('.mobile-menu'),
            menuWidth = $menu.css('width'),
            isVisible = ($menu.css('right') === '0px'),
            duration = 700;

        if (isVisible) {
            $menu.animate({'right': '-' + menuWidth}, duration);
        } else {
            $menu.animate({'right': '0px'}, duration);
        }
    };

    /**
     * (Private)
     * Event-scoped method for hiding the mobile nav menu with an off-click
     * @param {Object} event
     */
    var offClick = function (event) {
        var $menu = $('.mobile-menu'),
            menuWidth = $menu.css('width'),
            isMenuVisible = ($menu.css('right') === '0px'),
            duration = 700,
            isMenuToggle = $(event.target).closest('.expand-mobile-menu, .mobile-menu').length;

        if (isMenuVisible && !isMenuToggle) {
            $menu.animate({'right': '-' + menuWidth}, duration);
        }
    };

    /**************************/
    /* Public/Exposed methods */
    /**************************/
    return {
        /**
         * (Public)
         * Attach event listeners to handle expand/collapse of the mobile nav menu
         */
        initializeMobileMenu: function () {
            // Toggle the menu via the expander (hamburger)
            $('.expand-mobile-menu .hamburger, .mobile-cancel .close').on('click touchstart', appUtils.debounce(toggleNav, 250, true));
            // Hide the menu on off-clicks
            $('body').on('click touchstart', appUtils.debounce(offClick, 250, true));
            // Logout action
            $('li.logout a').on('click touchstart', function () {
                event.preventDefault();
                //window.location = ('/Logout/');
            });
        },

        /**
         * (Public)
         * Initialize app-wide modals
         */
        initializeModalActions: function () {
            // Close/Cancel the General Error modal
            $('.general-error-modal .title-close, .close-general-error').on('click', function (event) {
                event.preventDefault();
                appUtils.closeModal('.general-error-modal', function () {
                    $('.general-error-modal .error-message').html('');
                });
            });

            // Show the TAC modal
            $('.terms-and-conditions').on('click', function (event) {
                event.preventDefault();
                appUtils.openModal('.tac-modal');
            });

            // Close/Cancel the TAC modal
            $('.tac-modal .title-close, .close-tac').on('click', function (event) {
                event.preventDefault();
                appUtils.closeModal('.tac-modal');
            });

            // Fade the TAC modal scroll indicator
            $('.tac-modal .modal-message').on('scroll', function () {
                var $message = $(this),
                    scrollVar = $message.scrollTop();

                $message.children('.nudge-arrow').css({'opacity': ( 100-scrollVar ) / 100 });
            });

            // Show the Disclaimer modal
            $('.disclaimer').on('click', function (event) {
                event.preventDefault();
                appUtils.openModal('.disclaimer-modal');
            });

            // Close/Cancel the Disclaimer modal
            $('.disclaimer-modal .title-close, .close-disclaimer').on('click', function (event) {
                event.preventDefault();
                appUtils.closeModal('.disclaimer-modal');
            });

            // Fade the Disclaimer modal scroll indicator
            $('.disclaimer-modal .modal-message').on('scroll', function () {
                var $message = $(this),
                    scrollVar = $message.scrollTop();

                $message.children('.nudge-arrow').css({'opacity': ( 100-scrollVar ) / 100 });
            });
        },

    };

})();

/*************/
/* DOM Ready */
/*************/
$(document).ready(function () {
    'use strict';

    var router = app.router;

    // Call to initialze the JS module for the page
    router.route(window.location.href);

});

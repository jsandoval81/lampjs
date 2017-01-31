/**
 * @copyright 2016 InspiringApps
 * @link http://www.inspiringapps.com
 *
 * Custom utility module that extends jQuery as needed
 */

(function ($) {
    /**
     * A method that form elements can use to serialize their data into JSON.
     * Usage example: $('form').serializeObject.
     */
    $.fn.serializeObject = function () {
        'use strict';

        var o = {},
            a = this.serializeArray();

        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });

        return o;
    };

})(jQuery);

(function ($) {
    /**
     * A method that can be used per app to set a custom content render animation
     * for cases where the render is frequently used and needs to be consistent.
     */
    $.fn.showUI = function () {
        return this.fadeIn(400);
    }

})(jQuery);

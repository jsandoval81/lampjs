/**
 * @copyright 2016 InspiringApps
 * @link http://www.inspiringapps.com
 *
 * Utility module that creates data-related utility methods.
 *
 * Note: Libraries like Moment and Numeral are used for most of the date and number transformations.
 *
 * @return {Object}
 */
/**************************/
/* Custom utility methods */
/**************************/
app.dataUtils = (function () {
    'use strict';

    /**************************/
    /* Public/Exposed methods */
    /**************************/
    return {
        /**
         * Utility method to deserialize the server UTC datetimes into
         * locally formatted datetimes. It creates a string version that is
         * immediately usable/sortable - it also includes a Moment object
         * version that can be very handy for creating different formats,
         * checking validity, etc.
         * @param  {Array of objects} data
         * @param  {Array of strings} dateFields
         * @return {Array of objects} deserialized
         */
        deserializeDates: function (data, dateFields, defaultFormat) {
            var deserialized = [],
                outputFormat = (defaultFormat) ? defaultFormat : 'YYYY-MM-DD HH:mm:ss';

            // Map the input array
            deserialized = data.map(function (record) {
                // Loop the input date fields and create siblings on the record
                dateFields.forEach(function (fieldName) {
                    var localMoment = moment.utc(record[fieldName]),
                        localDate = localMoment.toDate(),
                        localValueFormatted = moment(localDate).format(outputFormat);

                    record[fieldName + 'LocalMoment'] = localMoment;
                    record[fieldName + 'Local'] = localValueFormatted;
                });

                return record;
            });

            return deserialized;
        },

        /**
         * Async image prefetch routine.
         * Initializes an array of src strings as Image object.
         * onload events check for total completion before executing a callback.
         * @param {Array} images
         * @param {Function} done
         */
        prefetchImages: function (images, done) {
            var imagesLength = images.length,
                completed = [];

            images.forEach(function (imageSrc) {
                var img = new Image();

                img.onload = function () {
                    // Push the completed src to the progress array
                    completed.push(imageSrc);
                    // Check if all images have been loaded
                    if (completed.length === imagesLength) {
                        done();
                    }
                };
                img.src = imageSrc;
            });
        },

        /**
         * Async image encode to base64 using the FileReader Web API
         * @param {File} imageFile
         * @param {Function} done
         */
        base64EncodeImage: function (imageFile, done) {
            var isImage = (imageFile && imageFile instanceof File),
                isCallback = (done && typeof done === 'function'),
                encodingComplete = function () {
                    fileReader.removeEventListener('load', encodingComplete);
                    done(fileReader.result);
                };

            if (isImage && isCallback) {
                fileReader.addEventListener('load', encodingComplete);
                fileReader.readAsDataURL(imageFile);
            } else if (isCallback) {
                done(undefined);
            }
        },

    };

})();

/**
 * @copyright 2016 InspiringApps
 * @link http://www.inspiringapps.com
 *
 * Utility module that extends the prototype of native JS objects.
 *
 * Extending native JS objects is sometimes debated, so rather than extend
 * in contextual modules we just extend here so that folks can see all
 * of the extensions in one place.
 */
/*******************************/
/* String prototype extensions */
/*******************************/
/**
 * A basic noun singularization method
 * @return {string} singular
 */
String.prototype.singular = function () {
    'use strict';
    var singular,
        isAcronym = (this === this.toUpperCase());

    if (this && this.length) {
        if (isAcronym) {
            singular = this;
        } else {
            singular = this.replace(/ies$/, 'y');
            singular = singular.replace(/s$/, '');
        }
    }

    return singular;
};

/**
 * A basic noun pluralization method
 * @return {string} plural
 */
String.prototype.plural = function () {
    'use strict';
    var plural,
        isAcronym = (this === this.toUpperCase());

    if (this && this.length) {
        if (isAcronym) {
            plural = this;
        } else if (this.match(/y$/)) {
            plural = this.replace(/y$/, 'ies');
        } else if (!this.match(/s$/)) {
            plural = this + 's';
        } else {
            plural = this;
        }
    }

    return plural;
};

/**
 * A basic initial capitalization method
 * @return {string}
 */
String.prototype.initialCap = function () {
    'use strict';

    return this.charAt(0).toUpperCase() + this.slice(1);
};

/******************************/
/* Array prototype extensions */
/******************************/
/**
 * Sort an array of objects by an object property name.
 * @param  {string} property
 * @param  {string} [direction] ['asc', 'desc']
 * @return {Array} sortedArray
 */
Array.prototype.sortBy = function (property, direction) {
    'use strict';

    var sortedArray,
        directionMultiplier = (direction === 'desc') ? -1 : 1;

    sortedArray = this.sort(function (a, b) {
        var sortNum = 0;

        if (a[property] > b[property]) {
            sortNum = 1;
        }
        if (a[property] < b[property]) {
            sortNum = -1;
        }

        return (sortNum * directionMultiplier);
    });

    return sortedArray;
};

/**
 * Sort an array of objects by multiple object property names.
 * @param  {Array} properties
 * @param    {Array[string]} [properties.name]
 * @param    {Array[string]} [properties.direction] ['asc', 'desc']
 * @return {Array} sortedArray
 */
Array.prototype.sortByMultiple = function (properties) {
    'use strict';

    var numProperties = properties.length,
        sortedArray;

    sortedArray = this.sort(function (a, b) {
        var directionMultiplier,
            sortNum,
            sortValA,
            sortValB,
            i;

        for (i = 0; i < numProperties; i += 1) {
            directionMultiplier = (properties[i].direction === 'desc') ? -1 : 1;
            sortNum = 0;
            sortValA = a[properties[i].name];
            sortValB = b[properties[i].name];

            if (typeof sortValA === 'string') {
                sortValA = sortValA.toLowerCase();
            }
            if (typeof sortValB === 'string') {
                sortValB = sortValB.toLowerCase();
            }

            if (sortValA > sortValB) {
                sortNum = 1;
            }
            if (sortValA < sortValB) {
                sortNum = -1;
            }

            if (sortNum !== 0) {
                break;
            }
        }

        return (sortNum * directionMultiplier);

    });

    return sortedArray;
};

/**
 * Search an array of objects by an object property
 * @param  {string} property
 * @param  {*} value
 * @return {Number} searchIndex
 */
Array.prototype.memberIndexOf = function (property, value) {
    'use strict';

    var length = this.length,
        i,
        searchIndex = -1;

    if (property && typeof property === 'string') {
        for (i = 0; i < length; i += 1) {
            if (this[i][property] === value) {
                searchIndex = i;
                break;
            }
        }
    }

    return searchIndex;
};

/**
 * Find the maximum value in an array of primitives (likely numbers)
 * @return {*} max
 */
Array.prototype.findMax = function () {
    'use strict';

    var arrayLength = this.length,
        max,
        i;

    for (i = 0; i < arrayLength; i += 1) {
        if (i === 0) {
            max = this[i];
        } else if (this[i] > max) {
            max = this[i];
        }
    }

    return max;
};

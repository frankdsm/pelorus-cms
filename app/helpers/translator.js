'use strict';

var _ = require('lodash');

// Translate items
// Item ==> Complete object
// Lang ==> Language key of the required language
var translate = function(item, lang) {
    // Create (just to be sure) JSON object instead of Mongoose object
    item = JSON.parse(JSON.stringify(item));
    // Loop over all the keys in the object
    _.forEach(Object.keys(item), function(i) {
        if(_.isArray(item[i])) {
            // If array, call the same function again
            item[i] = translate(item[i], lang);
        } else if(_.isObject(item[i])) {
            // If object, check if multiLanguage is available and if is true
            if(item[i].hasOwnProperty('multiLanguage') && item[i].multiLanguage) {
                if(item[i].hasOwnProperty(lang)) {
                    // Check if required language is available
                    item[i] = item[i][lang];
                } else {
                    // If not available, delete item
                    delete item[i];
                }
            } else {
                item[i] = translate(item[i], lang);
            }
        }
    });
    return item;
};
exports.translate = translate;

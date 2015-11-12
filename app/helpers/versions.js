'use strict';

var _ = require('lodash');

// Create new version of current item
// Model ==> Model of current item
// Item ==> Item which requires a new version
var add = function(Model, item, callback) {
    // Find old document
    Model.findOne({uuid: item.uuid})
        .lean()
        .exec(function(err, old) {
            if(!err && old) {
                // Create empty array of verions if there is not array
                if(!old.hasOwnProperty('versions')) {
                    old.versions = [];
                }
                // Set all versions from old document to new document
                item.versions = _.cloneDeep(old.versions);
                // Remove versions from old document
                old.versions = [];
                // Add old document to new document versions array
                item.versions.push(old);
                callback(item);
            } else {
                callback(item);
            }
        });
};
exports.add = add;

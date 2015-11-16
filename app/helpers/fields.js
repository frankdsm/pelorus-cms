'use strict';

require('rootpath')();
var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId,
    Type = require('app/models/contentType'),
    Content = require('app/models/content'),
    Taxonomy = require('app/models/taxonomy');

// Find all old fields
function findFields(uuid, callback) {
    // Find one content type
    Type.findOne({uuid: uuid}, {fields: 1})
        .exec(function(err, type) {
            if(!err && type) {
                callback(false, type.fields);
            } else {
                callback(true, null);
            }
        });
}

// Match fields with old fields
function matchFields(oldFields, newFields, callback) {
    var difference = [],
        index;
    // Loop over old fields
    _.forEach(oldFields, function(o, k) {
        // Find if all fields are still in new fields
        index = _.findIndex(newFields, function(n) {
            return n._id === o._id;
        });
        // If field is not found, add it to the array
        if(!~index) {
            difference.push(o._id);
        }
    });
    // Return removed fields
    callback(difference);
}

// Remove all fields in content because they were removed in Content Type
function removeFields(uuid, fields, callback) {
    var unset = {};
    // Create unset object
    _.forEach(fields, function(f) {
        unset['fields.' + f] = '';
    });
    // Find content type _id
    Type.findOne({uuid: uuid}, {_id: 1})
        .lean()
        .exec(function(err, contentType) {
            if(!err && contentType) {
                // Update all content of this Content Type
                Content.update({contentType: contentType._id.toString()},
                                {$unset: unset},
                                {multi: true})
                    .exec(function(err, update) {
                        callback();
                    });
            } else {
                callback();
            }
        });
}


// Populate a taxonomy field
// @return promise
var populateTaxonomyField = function(taxonomyIds) {
    taxonomyIds = _.map(taxonomyIds, function(id) {
        return new ObjectId(id);
    });

    return Taxonomy.aggregate([
        {
            $unwind: '$tags'
        }, {
            $match: {
                'tags._id': { $in: taxonomyIds }
            },
        }, {
            $project: {
                'safeLabel': '$tags.safeLabel',
                'label': '$tags.label',
                'uuid': '$tags.uuid',
                '_id': '$tags._id'
            }
        }
    ]).exec();
};


// Check fields
exports.check = function(uuid, newFields, callback) {
    // Find all fields
    findFields(newFields.uuid, function(err, oldFields) {
        if(!err) {
            // Match missing fields
            matchFields(oldFields, newFields.fields, function(difference) {
                if(difference.length > 0) {
                    // Remove fields if necessary
                    removeFields(newFields.uuid, difference, function() {
                        // We're done
                        callback();
                    });
                } else {
                    // There are no fields to delete
                    callback();
                }
            });
        } else {
            // Content Type not found, return to update function
            callback();
        }
    });
};


// Populate all the fields of content
// @return promise
exports.populateFields = function(content) {

    var _deferredGlobal = q.defer();

    var _promises = [];

    var _fields = content.fields;
    var _interfaces = content.meta.contentType.fields;

    // Loop over every field and check it's type to see if it needs to be populated
    _.forEach(_fields, function(value, key) {
        var _deferred = q.defer();

        // Get the field interface
        var _fieldInterface = _.find(_interfaces, {'_id': key});

        // Populate the taxonomy fields
        if (_fieldInterface && _fieldInterface.type === 'taxonomy') {
            populateTaxonomyField(value)
                .then(
                    function onSuccess(taxonomy) {
                        _fields[key] = taxonomy;

                        // Data is saved by reference, so no data needs to be returned here.
                        _deferred.resolve();
                    },
                    function onError() {
                        _deferred.reject();
                    }
                );
        } else {
            // Data is saved by reference, so no data needs to be returned here.
            _deferred.resolve();
        }

        _promises.push(_deferred.promise);
    });

    // When all the fields are populated, return the content object
    q.all(_promises)
        .then(
            function onSuccess() {
                // Return the entire contentObject in the promise
                _deferredGlobal.resolve(content);
            }
        );

    return _deferredGlobal.promise;
};

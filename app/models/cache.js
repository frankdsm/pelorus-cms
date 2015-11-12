'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Mixed = Schema.Types.Mixed,
    uuid = require('node-uuid');

var CacheSchema = new Schema({
    uuid: {
        type: String,
        default: uuid,
        required: true,
        index: true
    },
    key: {
        type: String,
        required: true
    },
    value: {
        type: Mixed,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

// Set the name of the collection
CacheSchema.set('collection', 'cache');

module.exports = mongoose.model('Cache', CacheSchema);

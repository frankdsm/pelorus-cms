'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uuid = require('node-uuid');

var ExampleSchema = new Schema({
    uuid: {
        type: String,
        default: uuid,
        required: true,
        index: true
    },
    property: {
        type: String,
        required: true
    },
    deleted: {
        type: Boolean,
        required: true,
        default: false
    }
});

// Set the name of the collection
ExampleSchema.set('collection', 'examples');

module.exports = mongoose.model('Example', ExampleSchema);

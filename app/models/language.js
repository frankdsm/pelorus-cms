'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uuid = require('node-uuid');

var LanguageSchema = new Schema({
    uuid: {
        type: String,
        default: uuid,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    localizedName: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: false
    }
});

// Set the name of the collection
LanguageSchema.set('collection', 'languages');

module.exports = mongoose.model('Language', LanguageSchema);

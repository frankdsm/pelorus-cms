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

LanguageSchema.set('toJSON', {});

LanguageSchema.set('toObject', {});

// Set the name of the collection
LanguageSchema.set('collection', 'languages');

if (!LanguageSchema.options.toObject) {
    LanguageSchema.options.toObject = {};
}

LanguageSchema.options.toObject.transform = function (doc, ret) {
    delete ret.__v;
};

if (!LanguageSchema.options.toJSON) {
    LanguageSchema.options.toJSON = {};
}

LanguageSchema.options.toJSON.transform = function (doc, ret) {
    delete ret.__v;
};

module.exports = mongoose.model('Language', LanguageSchema);

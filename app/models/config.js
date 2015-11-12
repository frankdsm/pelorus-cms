'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uuid = require('node-uuid');

var ConfigSchema = new Schema({
    uuid: {
        type: String,
        default: uuid,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['variables', 'settings'],
        unique: true
    },
    data: {
        siteRoot: {
            type: String
        },
        siteName: {
            type: String
        },
        siteHome: {
            type: String,
            ref: "Page"
        }
    },
    versions: [],
}, {strict: false});

ConfigSchema.set('toJSON', {});

ConfigSchema.set('toObject', {});

// Set the name of the collection
ConfigSchema.set('collection', 'config');

if (!ConfigSchema.options.toObject) {
    ConfigSchema.options.toObject = {};
}

ConfigSchema.options.toObject.transform = function (doc, ret) {
    delete ret.__v;
};

if (!ConfigSchema.options.toJSON) {
    ConfigSchema.options.toJSON = {};
}

ConfigSchema.options.toJSON.transform = function (doc, ret) {
    delete ret.__v;
};

module.exports = mongoose.model('Config', ConfigSchema);

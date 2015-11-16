'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Mixed = Schema.Types.Mixed,
    uuid = require('node-uuid');

var FooterSchema = new Schema({
    uuid: {
        type: String,
        default: uuid,
        required: true,
        index: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    links: {
        multiLanguage: {
            type: Boolean,
            required: true,
            default: true
        }
    },
    address: {
        type: Mixed,
        multiLanguage: {
            type: Boolean,
            required: true,
            default: true
        }
    },
    email: {
        multiLanguage: {
            type: Boolean,
            required: true,
            default: true
        }
    },
    phone: {
        multiLanguage: {
            type: Boolean,
            required: true,
            default: true
        }
    },
    versions: []
}, {strict: false});

FooterSchema.set('toJSON');

FooterSchema.set('toObject');

// Set the name of the collection
FooterSchema.set('collection', 'footer');

if (!FooterSchema.options.toObject) {
    FooterSchema.options.toObject = {};
}

FooterSchema.options.toObject.transform = function (doc, ret) {
    delete ret.__v;
};

if (!FooterSchema.options.toJSON) {
    FooterSchema.options.toJSON = {};
}

FooterSchema.options.toJSON.transform = function (doc, ret) {
    delete ret.__v;
};

module.exports = mongoose.model('Footer', FooterSchema);

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uuid = require('node-uuid');

var ViewSchema = new Schema({
    uuid: {
        type: String,
        default: uuid,
        required: true,
        index: true
    },
    query: {
        contentType: {
            type: String,
            ref: 'ContentType'
        },
        conditions: [],
        options: {},
        page: {
            type: String,
            ref: 'Page'
        }
    },
    meta: {
        label: {
            type: String,
            required: true
        },
        lastEditor: {
            type: String,
            ref: 'User'
        },
        created: {
            type: Date,
            default: Date.now
        },
        lastModified: {
            type: Date,
            default: Date.now
        },
        deleted: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    label: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    versions: []
}, {strict: false});

ViewSchema.set('toJSON');

ViewSchema.set('toObject');

// Set the name of the collection
ViewSchema.set('collection', 'views');

if (!ViewSchema.options.toObject) {
    ViewSchema.options.toObject = {};
}

ViewSchema.options.toObject.transform = function (doc, ret) {
    delete ret.__v;
};

if (!ViewSchema.options.toJSON) {
    ViewSchema.options.toJSON = {};
}

ViewSchema.options.toJSON.transform = function (doc, ret) {
    delete ret.__v;
};

module.exports = mongoose.model('View', ViewSchema);

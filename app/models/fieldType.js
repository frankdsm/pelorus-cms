'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Mixed = Schema.Types.Mixed,
    uuid = require('node-uuid');

var FieldSchema = new Schema({
    uuid: {
        type: String,
        default: uuid,
        required: true,
        index: true
    },
    _id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    label: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    dataType: {
        type: String,
        required: true
    },
    operators: [
        {
            type: Mixed,
            required: true
        }
    ],
    validation: {
        type: Mixed
    },
    isMultiple: {
        type: Boolean,
        required: true,
        default: false
    },
    isTranslate: {
        type: Boolean,
        required: true,
        default: false
    },
    isQueryable: {
        type: Boolean,
        required: true,
        default: false
    }
});

FieldSchema.set('toJSON');

FieldSchema.set('toObject');

// Set the name of the collection
FieldSchema.set('collection', 'fieldtypes');

if (!FieldSchema.options.toObject) {
    FieldSchema.options.toObject = {};
}

FieldSchema.options.toObject.transform = function (doc, ret) {
    delete ret.__v;
};

if (!FieldSchema.options.toJSON) {
    FieldSchema.options.toJSON = {};
}

FieldSchema.options.toJSON.transform = function (doc, ret) {
    delete ret.__v;
};

module.exports = mongoose.model('FieldType', FieldSchema);

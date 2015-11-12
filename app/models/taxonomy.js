'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uuid = require('node-uuid');

var TaxonomySchema = new Schema({
    uuid: {
        type: String,
        default: uuid,
        required: true,
        index: true
    },
    label: {
        type: String,
        required: true
    },
    safeLabel: {
        type: String,
        required: true
    },
    tags: [{
        uuid: {
            type: String,
            default: uuid,
            required: true
        },
        label: {
            type: Object,
            required: true
        },
        safeLabel: {
            type: String,
            required: true
        }
    }]
});

TaxonomySchema.set('toJSON');

TaxonomySchema.set('toObject');

// Set the name of the collection
TaxonomySchema.set('collection', 'taxonomy');

if (!TaxonomySchema.options.toObject) {
    TaxonomySchema.options.toObject = {};
}

TaxonomySchema.options.toObject.transform = function (doc, ret) {
    delete ret.__v;
};

if (!TaxonomySchema.options.toJSON) {
    TaxonomySchema.options.toJSON = {};
}

TaxonomySchema.options.toJSON.transform = function (doc, ret) {
    delete ret.__v;
};

module.exports = mongoose.model('Taxonomy', TaxonomySchema);

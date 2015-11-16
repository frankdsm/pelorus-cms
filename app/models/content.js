'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uuid = require('node-uuid');

var ContentSchema = new Schema({
    uuid: {
        type: String,
        default: uuid,
        required: true,
        index: true
    },
    fields: {},
    // CRUD Metadata
    meta: {
        // The label is used as a fallback for display in the CMS
        label: {
            type: String,
            required: true
        },
        // Content Taxonomy
        taxonomy: {
            dataType: {
                type: String,
                default: 'taxonomy'
            },
            tags: [
            ]
        },
        created: {
            type: Date,
            default: Date.now
        },
        lastModified: {
            type: Date,
            default: Date.now
        },
        lastEditor: {
            type: String,
            ref: 'User'
        },
        published: {
            type: Boolean,
            default: false
        },
        publishDate: {
            type: Date
        },

        // Active languages
        activeLanguages: [],

        // Content Type Reference
        contentType : {
            type: String,
            ref: 'ContentType'
        },

        // Flags
        hasDetail: {
            type: Boolean,
            required: true,
            default: true
        },
        deleted: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    solr: {
        indexed: {}
    },
    versions: []
}, {strict: false});

ContentSchema.set('toJSON');

ContentSchema.set('toObject');

// Set the name of the collection
ContentSchema.set('collection', 'content');

if (!ContentSchema.options.toObject) {
    ContentSchema.options.toObject = {};
}

ContentSchema.options.toObject.transform = function (doc, ret) {
    delete ret.__v;
};

if (!ContentSchema.options.toJSON) {
    ContentSchema.options.toJSON = {};
}

ContentSchema.options.toJSON.transform = function (doc, ret) {
    delete ret.__v;
};


// ContentSchema hooks
ContentSchema.pre('save', function(next) {
    //console.log('do this before I save');
    next();
});

// Pre update
ContentSchema.pre('update', function(next) {

    //console.log("do this before I update");

    // Update meta object
    var metaObject = {
        $set: {
            meta: {
                lastModified: new Date(),
                lastEditor: ''
            }
        }
    };

    // Set updated
    this.update({}, metaObject);

    // Proceed and update
    next();
});

// Pre find
ContentSchema.pre('findOne', function(next) {
    //console.log('Check if permissions');

    next();
});


module.exports = mongoose.model('Content', ContentSchema);

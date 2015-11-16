'use strict';

var mongoose = require('mongoose'),
    deepPopulate = require('mongoose-deep-populate')(mongoose),
    Schema = mongoose.Schema,
    Mixed = Schema.Types.Mixed,
    uuid = require('node-uuid');

var PageSchema = new Schema({
    uuid: {
        type: String,
        default: uuid,
        required: true,
        index: true
    },
    contentReference: {
        type: String,
        ref: 'Content'
    },
    views: [{
        _id: false,
        title: {
            type: Mixed,
            multiLanguage: {
                type: Boolean,
                required: true,
                default: true
            }
        },
        reference: {
            type: String,
            //to do: add reference to view
        }
    }],
    meta: {
        indexed: {},
        deleted: {
            type: Boolean,
            required: true,
            default: false
        },
        published: {},
        publishDate: {},
        // The label is used as a fallback for display in the CMS
        label: {
            type: String,
            required: true
        },
        // The title is used for display in the CMS / Frontend
        title: {
            type: Mixed,
            multiLanguage: {
                type: Boolean,
                required: true,
                default: true
            }
        },
        slug: {
            multiLanguage: {
                type: Boolean,
                required: true,
                default: true
            }
        },
        // Active languages
        activeLanguages: [],
        description: {
            type: String
        },
        createdFromContent: {
            type: Boolean,
            required: true,
            default: false
        },
        lastEditor: {
            type: String,
            ref: 'User'
        },
        lastModified: {
            type: Date,
            default: new Date()
        }
    },
    versions: []
}, {strict: false});

PageSchema.set('toJSON');

PageSchema.set('toObject');

// Set the name of the collection
PageSchema.set('collection', 'pages');

if (!PageSchema.options.toObject) {
    PageSchema.options.toObject = {};
}

// Register deepPopulate plugin
PageSchema.plugin(deepPopulate, {});

PageSchema.options.toObject.transform = function (doc, ret) {
    delete ret.__v;
};

if (!PageSchema.options.toJSON) {
    PageSchema.options.toJSON = {};
}

PageSchema.options.toJSON.transform = function (doc, ret) {
    delete ret.__v;
};


PageSchema.pre('update', function(next) {

    // Check if it's an actual update or a soft delete
    var _delete = this._update.$set.meta.deleted,
        _metaObject = {};

    if (_delete) {
            // On a delete, set the property using "paths"
        _metaObject = {
            $set: {
                'meta.lastModified': new Date(),
                'meta.lastEditor': ''
            }
        };
    } else {
        // On an update, set the property using "object"
        _metaObject = {
            $set: {
                meta: {
                    lastModified: new Date(),
                    lastEditor: ''
                }
            }
        };
    }

    // Set updated
    this.update({}, _metaObject);


    // Proceed and update
    next();
});

module.exports = mongoose.model('Page', PageSchema);

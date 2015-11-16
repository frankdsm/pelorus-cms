'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Mixed = Schema.Types.Mixed,
    uuid = require('node-uuid');

var ContentTypeSchema = new Schema({
    uuid: {
        type: String,
        default: uuid,
        required: true,
        index: true
    },
    meta: {
        label: {
            type: String,
            required: true,
            trim: true
        },
        safeLabel: {
            type: String,
            required: true
        },
        created: {
            type: Date,
            default: Date.now
        },
        lastModified: {
            type: Date,
            default: Date.now
        },
        description: {
            type: String
        },
        taxonomy: {
            fieldType: {
                type: String,
                default: 'taxonomy'
            },
            tags: [
            ]
        },
        deleted: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    fields: [{
        uuid: {
            type: String,
            required: true,
            default: uuid
        },
        _id: {
            type: String,
            required: true
        },
        dataType: {
            type: String,
            required: true,
            enum: ['bool', 'date', 'object', 'string', 'int', 'file', 'option', 'array']
        },
        defaultValue: {
            type: String
        },
        validation: {
            type: Mixed
        },
        operators: {
            type: Mixed
        },
        type: {
            type: String,
            required: true
        },
        contentType: {
            type: String,
            ref: 'ContentType'
        },
        min: {
            type: Number,
            required: true,
            default: 1
        },
        max: {
            type: Number,
            required: true,
            default: 1
        },
        minimageheight: {
            type: Number
        },
        minimagewidth: {
            type: Number
        },
        options: [{
            _id: {
                type: String
            },
            label: {
                type: String
            }
        }],
        label: {
            type: String,
            required: true
        },
        multiLanguage: {
            type: Boolean,
            required: true,
            default: false
        }
    }],
    solr: {
        type: Boolean,
        required: true,
        default: false
    },
    versions: []
});

ContentTypeSchema.set('toJSON');

ContentTypeSchema.set('toObject');

// Set the name of the collection
ContentTypeSchema.set('collection', 'contenttypes');

if (!ContentTypeSchema.options.toObject) {
    ContentTypeSchema.options.toObject = {};
}

ContentTypeSchema.options.toObject.transform = function (doc, ret) {
    delete ret.__v;
};

if (!ContentTypeSchema.options.toJSON) {
    ContentTypeSchema.options.toJSON = {};
}

ContentTypeSchema.options.toJSON.transform = function (doc, ret) {
    delete ret.__v;
};


// ContentTypeSchema hooks
// Pre update
ContentTypeSchema.pre('update', function(next) {

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


module.exports = mongoose.model('ContentType', ContentTypeSchema);

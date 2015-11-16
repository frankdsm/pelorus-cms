'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uuid = require('node-uuid');

var RoleSchema = new Schema({
    uuid: {
        type: String,
        default: uuid,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    contentTypes: [{
        _id: false,
        type: {
            type: String,
            ref: 'ContentType'
        },
        permissions: {
            create: {
                type: Boolean,
                required: true,
                default: false
            },
            read: {
                type: Boolean,
                required: true,
                default: false
            },
            update: {
                type: Boolean,
                required: true,
                default: false
            },
            delete: {
                type: Boolean,
                required: true,
                default: false
            }
        }
    }],
    operations: [{
        _id: false,
        type: {
            type: String,
            required: true
        },
        permissions: {
            create: {
                type: Boolean,
                required: true,
                default: false
            },
            read: {
                type: Boolean,
                required: true,
                default: false
            },
            update: {
                type: Boolean,
                required: true,
                default: false
            },
            delete: {
                type: Boolean,
                required: true,
                default: false
            }
        }
    }],
    deleted: {
        type: Boolean,
        required: true,
        default: false
    }
});

RoleSchema.set('toJSON');

RoleSchema.set('toObject');

// Set the name of the collection
RoleSchema.set('collection', 'roles');

if (!RoleSchema.options.toObject) {
    RoleSchema.options.toObject = {};
}

RoleSchema.options.toObject.transform = function (doc, ret) {
    delete ret.__v;
};

if (!RoleSchema.options.toJSON) {
    RoleSchema.options.toJSON = {};
}

RoleSchema.options.toJSON.transform = function (doc, ret) {
    delete ret.__v;
};

module.exports = mongoose.model('Role', RoleSchema);

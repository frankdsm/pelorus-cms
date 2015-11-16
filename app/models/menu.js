'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uuid = require('node-uuid');

var MenuSchema = new Schema({
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
    menu: [{
        id: {
            type: String,
            required: true
        },
        uuid: {
            type: String,
            default: uuid,
            required: true
        },
        parent: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        state: {
            opened: {
                type: Boolean,
                required: true,
                default: true
            }
        },
        data: {
            content: {
                type: String,
                ref: 'Page'
            }
        }
    }]
});

MenuSchema.set('toJSON');

MenuSchema.set('toObject');

// Set the name of the collection
MenuSchema.set('collection', 'menu');

if (!MenuSchema.options.toObject) {
    MenuSchema.options.toObject = {};
}

MenuSchema.options.toObject.transform = function (doc, ret) {
    delete ret.__v;
};

if (!MenuSchema.options.toJSON) {
    MenuSchema.options.toJSON = {};
}

MenuSchema.options.toJSON.transform = function (doc, ret) {
    delete ret.__v;
};

module.exports = mongoose.model('Menu', MenuSchema);

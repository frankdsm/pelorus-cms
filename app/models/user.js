'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uuid = require('node-uuid');

var UserSchema = new Schema({
    uuid: {
        type: String,
        default: uuid,
        required: true,
        index: true
    },
    type: {
        type: String,
        required: true,
        enum: ['twitter'],
        default: 'twitter'
    },
    name: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    enabled: {
        type: Boolean,
        required: true,
        default: true
    },
    lastLogin: {
        type: Date,
        required: true,
        default: Date.now
    }
});

// Set the name of the collection
UserSchema.set('collection', 'users');

module.exports = mongoose.model('User', UserSchema);

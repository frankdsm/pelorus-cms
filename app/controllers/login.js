'use strict';

require('rootpath')();
var uuid = require('node-uuid'),
    userModel = require('app/models/user');

exports.authorize = function(user, type, callback) {
    userModel.update({
            type: type,
            userId: user._json.id
        }, {
            $set: {
                type: type,
                name: user.displayName,
                userId: user._json.id,
                avatarUrl: user._json.profile_image_url.replace('_normal', '')
            },
            $setOnInsert: {
                uuid: uuid(),
                created: new Date(),
                lastLogin: new Date(),
                enabled: false,
            }
        }, {
            upsert: true
        })
        .exec(function(err, update) {
            if (!err && update) {
                callback(true);
            } else {
                callback(false);
            }
        });
};

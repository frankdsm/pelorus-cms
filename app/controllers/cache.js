'use strict';

require('rootpath')();
var cacheModel = require('app/models/cache');

exports.set = function (key, value, callback) {
    cacheModel.update({key: key}, { key: key, value: value, created: new Date() }, {upsert:true})
        .exec(function(err, update) {
            if(!err && update) {
                if(callback) {
                    callback();
                }
            } else {
                if(callback) {
                    callback(err);
                }
            }
        });
};

exports.get = function (key, expiresTime, callback) {
    cacheModel.findOne({key: key})
        .exec(function(err, item) {
            if(!err && item) {
                if(!expiresTime) {
                    expiresTime = 10;
                }
                var startdate = new Date(item.created);
                var expireDate = new Date(startdate.getTime() + (1000 * expiresTime));
                var now = new Date();
                if(expireDate < now) {
                    if(callback) {
                        callback(false);
                    }
                } else {
                    if(callback) {
                        callback(false, item.value);
                    }
                }
            } else {
                if(callback) {
                    callback(err);
                }
            }
        });
};

exports.remove = function (key, callback) {
    cacheModel.findOne({key: key})
        .remove()
        .exec(function(err, result) {
            if(!err && result) {
                if(callback) {
                    callback();
                }
            } else {
                if(callback) {
                    callback(err);
                }
            }
        });
};

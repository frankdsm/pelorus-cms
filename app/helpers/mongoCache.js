'use strict';

require('rootpath')();
var Q = require('q'),
    cache = require('app/controllers/cache');

/*
 * Usage
 * var key ==> Unique key for cache
 * var time ==> Time to cache the data (in seconds)
 * mongoCache(key, time).otherwise(function(deferred, cacheKey) {
 *     // Get new data here
 *     if(success) {
 *         deferred.resolve(data);
 *     } else {
 *         deferred.reject('Some nice error message');
 *     }
 * }).then(function(data) {
 *     // Return the success call/callback here
 *     callback(null, data);
 * }).fail(function(err) {
 *     // Return the fail call/callback here
 *     callback(err, null);
 * });
 */
(function($module) {
    var MongoCache = function MongoCache() {};
    MongoCache.prototype = {
        key: null,
        promise: null,
        fetch: function fetch(key, expire) {
            var deferred = Q.defer();
            this.promise = deferred.promise;
            this.key = key;
            cache.get(key, expire, function(err, result) {
                if(err || !result) {
                    deferred.reject();
                    return;
                }
                deferred.resolve(result);
            });
            return this;
        },
        otherwise: function otherwise(method) {
            var deferred = Q.defer(),
                key = this.key;
            this.promise.then(function(collection) {
                deferred.resolve(collection);
            }).fail(function() {
                method(deferred, key);
                deferred.promise.then(function(data) {
                    cache.set(key, data);
                });
            });
            return deferred.promise;
        },
        remove: function remove(key) {
            cache.remove(key);
        }
    };
    $module.exports = new MongoCache();
}(module));

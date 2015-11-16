'use strict';

require('rootpath')();
var _ = require('lodash'),
    configModel = require('app/models/config'),
    languageModel = require('app/models/language');

/**
 * @api {get} /api/1.0.0/language Get all languages
 * @apiGroup Language
 * @apiVersion 1.0.0
 *
 * @apiSuccess (200) {String} key Language key.
 * @apiSuccess (200) {String} name Language name.
 * @apiSuccess (200) {String} localizeName Localized name.
 * @apiSuccess (200) {String} uuid Unique uuid.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *       "property": "John Doe",
 *       "uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
 *       "id": "xxxxxxxxxxxxxxxxxxxxxxxx"
 *     }]
 */
exports.read = function (req, res, next) {
    languageModel.find()
        .exec(function(err, items) {
            if(!err && items) {
                res.status(200).json(items);
            } else {
                res.status(400).json({err: err});
            }
        });
};

// Get active languages
var activeLanguages = function activeLanguages() {
    return languageModel.find({active: true})
        .lean()
        .exec();
};
exports.activeLanguages = activeLanguages;
var activeLanguagesCallback = function activeLanguagesCallback(callback) {
    languageModel.find({active: true})
        .lean()
        .exec(function(err, languages) {
            callback(err, languages);
        });
};
exports.activeLanguagesCallback = activeLanguagesCallback;

// Get default language
var defaultLanguage = function(callback) {
    configModel.findOne({type: 'settings'}, {versions: 0})
        .lean()
        .exec(function(err, settings) {
            if(!err && settings) {
                if(settings.data.hasOwnProperty('defaultLanguage')) {
                    callback(false, settings.data.defaultLanguage);
                } else {
                    callback(true, null);
                }
            } else {
                callback(true, null);
            }
        });
};
module.exports.defaultLanguage = defaultLanguage;

// Combine default language with all the languages
var combineLanguages = function(languages, defaultLanguage) {
    var combined = _.map(languages, function(i){
        i.defaultLanguage = i.key === defaultLanguage;
        return i;
    });

    return _.sortByOrder(combined, ['defaultLanguage'], ['desc']);
};

/**
 * @api {get} /api/1.0.0/language/active Get active language
 * @apiGroup Language
 * @apiVersion 1.0.0
 *
 * @apiSuccess (200) {String} key Language key.
 * @apiSuccess (200) {String} name Language name.
 * @apiSuccess (200) {String} localizeName Localized name.
 * @apiSuccess (200) {String} uuid Unique uuid.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *       "_id": "xxxxxxxxxxxxxxxxxxxxxxxx",
 *       "key": "en",
 *       "name": "English",
 *       "localizedName": "English",
 *       "active": true,
 *       "uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
 *       "defaultLanguage": true
 *     }]
 */
exports.readActive = function (req, res) {
    // Get active languages
    activeLanguages().then(
        function onSuccess(response) {
            var languages = response;
            // Get default language
            defaultLanguage(function(err, defaultLanguage) {
                if(!err) {
                    // Return 2 results combined
                    res.status(200).json(combineLanguages(languages, defaultLanguage));
                } else {
                    res.status(400).json({err: err});
                }
            });
        }, function onError(responseError) {
            res.status(400).json({err: responseError});
        }
    );
};

/**
 * @api {get} /api/1.0.0/language/:uuid Get a single language
 * @apiParam {String} uuid Example uuid
 * @apiGroup Language
 * @apiVersion 1.0.0
 *
 * @apiSuccess (200) {String} key Language key.
 * @apiSuccess (200) {String} name Language name.
 * @apiSuccess (200) {String} localizeName Localized name.
 * @apiSuccess (200) {String} uuid Unique uuid.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "property": "John Doe",
 *       "uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
 *       "id": "xxxxxxxxxxxxxxxxxxxxxxxx"
 *     }
 */
exports.readOne = function (req, res, next) {
    languageModel.findOne({uuid: req.params.id})
        .exec(function(err, item) {
            if(!err && item) {
                res.status(200).json(item);
            } else {
                res.status(404).json({err: err});
            }
        });
};

/**
 * @api {put} /api/1.0.0/language/:uuid Update a language
 * @apiParam {String} uuid Example uuid
 * @apiGroup Language
 * @apiVersion 1.0.0
 *
 * @apiSuccess (200) {String} key Language key.
 * @apiSuccess (200) {String} name Language name.
 * @apiSuccess (200) {String} localizeName Localized name.
 * @apiSuccess (200) {String} uuid Unique uuid.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "property": "John Doe",
 *       "uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
 *       "id": "xxxxxxxxxxxxxxxxxxxxxxxx"
 *     }
 */
exports.update = function (req, res, next) {
    // Compatibility fix for old MongoDB versions
    delete req.body._id;
    languageModel.update({uuid: req.params.id}, req.body)
        .exec(function(err, update) {
            if(!err && update) {
                languageModel.findOne({uuid: req.params.id})
                    .exec(function(err, language) {
                        if(!err && language) {
                            res.status(200).json(language);
                        } else {
                            res.status(400).json({err: err});
                        }
                    });
            } else {
                res.status(400).json({err: err});
            }
        });
};

'use strict';

require('rootpath')();
var _ = require('lodash'),
    languageController = require('app/controllers/languages');

/**
 * @api {get} /api/session/language/ Get current language
 * @apiName Get language
 * @apiGroup Session
 * @apiVersion 1.0.0
 *
 * @apiSuccess (200) {String} language Short language String.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "language": "nl"
 *     }
 *
 * @apiError (400) {Object} / Empty object.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Language is not set
 *     { }
 */
exports.getLanguage = function(req, res, next) {
    if(req.session.hasOwnProperty('language')) {
        res.status(200).json({language: req.session.language});
    } else {
        res.status(400).json({});
    }
};

/**
 * @api {put} /api/session/language/ Set current language
 * @apiName Set language
 * @apiGroup Session
 * @apiVersion 1.0.0
 *
 * @apiParam {String} language New language.
 *
 * @apiSuccess (200) {String} language Short language String.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "language": "nl"
 *     }
 *
 * @apiError (409) {Object} / Empty object.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 409 Language is missing
 *     { }
 * @apiError (412) {String} err Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 412 Language is not defined on the server.
 *     { }
 */
exports.setLanguage = function(req, res, next) {
    var activeLanguages = [];

    // Validate language if it is allowed
    function validateLanguage(lang) {
        return ~_.findIndex(activeLanguages, function(l) {
            return l.key === lang.toLowerCase();
        });
    }

    // Set language
    function set() {
        if(req.body.hasOwnProperty('language')) {
            if(validateLanguage(req.body.language)) {
                req.session.language = req.body.language.toLowerCase();
                res.status(200).json({language: req.session.language});
            } else {
                res.status(412).json({err: 'Language not defined on the server.'});
            }
        } else {
            res.status(400).json({});
        }
    }

    // Get active languages
    languageController.activeLanguagesCallback(function(_err, _languages) {
        if(!_err) {
            activeLanguages = _languages;
        } else {
            activeLanguages = [];
        }
        set();
    });
};

'use strict';

require('rootpath')();
var Footer = require('app/models/footer'),
    versions = require('app/helpers/versions'),
    multiLanguage = require('app/helpers/multiLanguage');

/**
 * @api {get} /api/footer Get footer
 * @apiGroup Footer
 * @apiVersion 0.0.1
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.read = function (req, res, next) {
    Footer.find({active: true}, {versions: 0})
        .exec(function(err, footer) {
            if(!err && footer) {
                res.status(200).json(footer);
            } else {
                res.status(400).json({err: err});
            }
        });
};

/**
 * @api {put} /api/footer Update footer
 * @apiGroup Footer
 * @apiVersion 0.0.1
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.update = function (req, res, next) {
    // Compatibility fix for old MongoDB versions
    delete req.body._id;
    // Update version before save
    versions.create(Footer, req.body, function(data) {
        Footer.update({uuid: req.params.id}, data)
            .exec(function(err, update) {
                if(!err && update) {
                    Footer.findOne({}, {versions: 0})
                        .exec(function(err, footer) {
                            if(!err && footer) {
                                res.status(200).json(footer);
                            } else {
                                res.status(400).json({err: err});
                            }
                        });
                } else {
                    res.status(400).json({err: err});
                }
            });
    });
};

/**
 * @api {get} /api/footer/translated/:lang Get translated footer
 * @apiGroup Footer
 * @apiVersion 0.0.1
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.translated = function (req, res, next) {
    Footer.findOne({active: true})
        .populate('')
        .lean()
        .exec(function(err, footer) {
            if(!err && footer) {
                res.status(200).json(multiLanguage.translate(footer, req.params.lang));
            } else {
                res.status(400).json({err: err});
            }
        });
};

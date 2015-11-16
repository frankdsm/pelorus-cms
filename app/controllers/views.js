'use strict';

require('rootpath')();
var viewModel = require('app/models/view'),
    contentTypeModel = require('app/models/contentType'),
    contentController = require('app/controllers/contents'),
    versions = require('app/helpers/versions');

/**
 * @api {get} /api/view/ Get all views
 * @apiGroup View
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.read = function (req, res) {
    // Filter which content types may be returned
    if(req.session.hasOwnProperty('profile')) {
        viewModel.find({'meta.deleted': false}, {versions: 0})
            .populate('query.contentType')
            .exec(function(err, items) {
                if(!err && items) {
                    res.status(200).json(items);
                } else {
                    res.status(400).json({err: err});
                }
            });
    } else {
        res.status(401).json();
    }
};

/**
 * @api {get} /api/view/:uuid Get a single content document
 * @apiParam {String} uuid View uuid
 * @apiGroup View
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.readOne = function (req, res) {
    viewModel.findOne({uuid: req.params.id, 'meta.deleted': false}, {versions: 0})
        .populate('query.contentType')
        .exec(function(err, item) {
            if(!err && item) {
                res.status(200).json(item);
            } else {
                res.status(404).json({err: err});
            }
        });
};

/**
 * @api {post} /api/view Create a new view
 * @apiGroup View
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.create = function (req, res) {
    viewModel.create(req.body, function(err, create) {
        if(!err && create) {
            res.status(201).json(create);
        } else {
            res.status(400).json({err: err});
        }
    });
};

/**
 * @api {put} /api/view/:uuid Update a content document
 * @apiParam {String} uuid View uuid
 * @apiGroup View
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.update = function (req, res) {
    // Compatibility fix for old MongoDB versions
    delete req.body._id;

    // Update version before save
    versions.create(View, req.body, function(data) {
        //data.meta.lastEditor = req.session.profile._id.toString();
        //data.meta.publishDate = setPublishDate(data.meta.published, data.meta.publishDate);
        viewModel.update({uuid: req.params.id}, data)
            .exec(function(err, update) {
                if(!err && update) {
                    viewModel.findOne({uuid: req.params.id}, {versions: 0})
                        .populate('query.contentType')
                        .lean()
                        .exec(function(err, content) {
                            if(!err && content) {
                                res.status(200).json(content);
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
 * @api {delete} /api/view/:uuid Delete a content document
 * @apiParam {String} uuid View uuid
 * @apiGroup View
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 204 OK
 */
exports.delete = function (req, res) {
    viewModel.update({uuid: req.params.id},
                {$set: {'meta.deleted': true}})
        .exec(function(err, update) {
            if(update) {
                res.status(204).json({});
            } else {
                res.status(400).json({err: err});
            }
        });
};

/**
 * @api {get} /api/view/preview/:type Preview the result of a view of an content type
 * @apiParam {String} type content Type safeLabel
 * @apiGroup View
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {Array} Success-Response:
 *     HTTP/1.1 200 OK
 *     [ ]
 */
exports.previewContentType = function (req, res) {
    contentTypeModel.findOne({"meta.safeLabel": req.params.type})
        .lean()
        .exec()
        .then(
            function runViewsQuery(item) {
                req.body.contentType = item;
                if(!req.body.conditions) {
                    req.body.conditions = [];
                }
                if(!req.body.options) {
                    req.body.options = {limit: 0, offset: 0};
                }
                return contentController.viewsQuery(req.body);
            },
            function onError(responseError) {
                res.status(404).json({err: responseError});
            }
        )
        .then(
            function onViewsCompleted(response) {
                res.status(200).json(response);
            },
            function onViewsError(responseError) {
                res.status(400).json({err: responseError});
            }
        );
};

/**
 * @api {post} /api/view/preview Preview the result of a view
 * @apiGroup View
 * @apiVersion 1.0.0
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "contentType": "xxxxxxxxxxxxxxxxxxxxxxxx",
 *       "conditions": [],
 *       "options": []
 *     }
 *
 * @apiSuccessExample {Array} Success-Response:
 *     HTTP/1.1 200 OK
 *     [ ]
 */
exports.preview = function (req, res) {
    contentTypeModel.findOne({_id: req.body.contentType})
        .lean()
        .exec()
        .then(
            function runViewsQuery(item) {
                req.body.contentType = item;
                if(!req.body.conditions) {
                    req.body.conditions = [];
                }
                if(!req.body.options) {
                    req.body.options = {limit: 0, offset: 0};
                }
                return contentController.viewsQuery(req.body, req.params.lang);
            },
            function onError(responseError) {
                res.status(404).json({err: responseError});
            }
        )
        .then(
            function onViewsCompleted(response) {
                res.status(200).json(response);
            },
            function onViewsError(responseError) {
                res.status(400).json({err: responseError});
            }
        );
};

'use strict';

require('rootpath')();
var exampleModel = require('app/models/example');

/**
 * @api {get} /api/example Get all example documents
 * @apiName Get all examples
 * @apiGroup Example Docs
 * @apiVersion 0.0.1
 *
 * @apiSuccess (200) {String} property Property (random field for example).
 * @apiSuccess (200) {String} uuid Unique uuid.
 * @apiSuccess (200) {String} id Mongo _id.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *       "property": "John Doe",
 *       "uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
 *       "id": "xxxxxxxxxxxxxxxxxxxxxxxx"
 *     }]
 */
exports.read = function (req, res, next) {
    exampleModel.find({deleted: false})
        .exec(function(err, items) {
            if(!err && items) {
                res.status(200).json(items);
            } else {
                res.status(400).json({err: err});
            }
        });
};

/**
 * @api {get} /api/example/:uuid Get a single example document
 * @apiParam {String} uuid Example uuid
 * @apiName Get one example
 * @apiGroup Example Docs
 * @apiVersion 0.0.1
 *
 * @apiSuccess (200) {String} property Property (random field for example).
 * @apiSuccess (200) {String} uuid Unique uuid.
 * @apiSuccess (200) {String} id Mongo _id.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "property": "John Doe",
 *       "uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
 *       "id": "xxxxxxxxxxxxxxxxxxxxxxxx"
 *     }
 */
exports.readOne = function (req, res, next) {
    exampleModel.findOne({uuid: req.params.id, deleted: false})
        .exec(function(err, item) {
            if(!err && item) {
                res.status(200).json(item);
            } else {
                res.status(404).json({err: err});
            }
        });
};

/**
 * @api {post} /api/example Create a new example
 * @apiName Create a nex example
 * @apiGroup Example Docs
 * @apiVersion 0.0.1
 *
 * @apiSuccess (200) {String} property Property (random field for example).
 * @apiSuccess (200) {String} uuid Unique uuid.
 * @apiSuccess (200) {String} id Mongo _id.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "property": "John Doe",
 *       "uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
 *       "id": "xxxxxxxxxxxxxxxxxxxxxxxx"
 *     }
 */
exports.create = function (req, res, next) {
    exampleModel.create(req.body, function(err, create) {
        if(!err && create) {
            res.status(201).json(create);
        } else {
            res.status(400).json({err: err});
        }
    });
};

/**
 * @api {put} /api/example/:uuid Update an example document
 * @apiParam {String} uuid Example uuid
 * @apiName Update document
 * @apiGroup Example Docs
 * @apiVersion 0.0.1
 *
 * @apiSuccess (200) {String} property Property (random field for example).
 * @apiSuccess (200) {String} uuid Unique uuid.
 * @apiSuccess (200) {String} id Mongo _id.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "property": "John Doe",
 *       "uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
 *       "id": "xxxxxxxxxxxxxxxxxxxxxxxx"
 *     }
 */
exports.update = function (req, res, next) {
    exampleModel.update({uuid: req.params.id}, req.body)
        .exec(function(err, update) {
            if(!err && update) {
                exampleModel.findOne({uuid: req.params.id})
                    .exec(function(err, example) {
                        if(!err && example) {
                            res.status(200).json(example);
                        } else {
                            res.status(400).json({err: err});
                        }
                    });
            } else {
                res.status(400).json({err: err});
            }
        });
};

/**
 * @api {delete} /api/example/:uuid Delete an example document
 * @apiParam {String} uuid Example uuid
 * @apiName Delete example document
 * @apiGroup Example Docs
 * @apiVersion 0.0.1
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 204 OK
 */
exports.delete = function (req, res, next) {
    exampleModel.update({uuid: req.params.id},
                    {$set: {deleted: true}})
        .exec(function(err, update) {
            if(update) {
                res.status(204).json({});
            } else {
                res.status(400).json({err: err});
            }
        });
};

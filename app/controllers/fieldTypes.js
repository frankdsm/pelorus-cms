'use strict';

require('rootpath')();
var fieldTypeModel = require('app/models/fieldType.js');

/**
 * @api {get} /api/field/ Get all fields
 * @apiGroup Field
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.read = function (req, res, next) {
    fieldTypeModel.find({})
        .exec(function(err, items) {
            if(!err && items) {
                res.status(200).json(items);
            } else {
                res.status(400).json({err: err});
            }
        });
};

/**
 * @api {get} /api/field/:uuid Get a single field
 * @apiParam {String} uuid Field uuid
 * @apiGroup Field
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.readOne = function (req, res, next) {
    fieldTypeModel.findOne({uuid: req.params.id})
        .exec(function(err, item) {
            if(!err && item) {
                res.status(200).json(item);
            } else {
                res.status(404).json({err: err});
            }
        });
};

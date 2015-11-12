'use strict';

require('rootpath')();
var Config = require('app/models/config'),
    versions = require('app/helpers/versions');

/**
 * @api {get} /api/config/:type Get config file
 * @apiParam {String} type Config file type
 * @apiGroup Config
 * @apiVersion 0.0.1
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "config": {},
 *       "type": "xxxx",
 *       "uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
 *       "_id": "xxxxxxxxxxxxxxxxxxxxxxxx"
 *     }
 */
var readOne = function (req, res, next) {
    Config.findOne({type: req.params.stype}, {versions: 0})
        .populate('data.siteHome')
        .exec(function(err, item) {
            if(!err && item) {
                res.status(200).json(item);
            } else {
                res.status(400).json({err: err});
            }
        });
};
exports.readOne = readOne;

exports.update = function (req, res, next) {
    return null
};

'use strict';

require('rootpath')();
var config = require('app/models/config'),
    versions = require('app/helpers/versions');

/**
 * @api {get} /api/config/:type Get config file
 * @apiParam {String} type config file type
 * @apiGroup config
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
    config.findOne({type: req.params.type}, {versions: 0})
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


/**
 * @api {put} /api/config/:type Update config file
 * @apiParam {String} type config file type
 * @apiGroup config
 * @apiVersion 0.0.1
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "config": {},
 *       "type": "xxxx",
 *       "uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
 *       "id": "xxxxxxxxxxxxxxxxxxxxxxxx"
 *     }
 */
exports.update = function (req, res, next) {
    // Compatibility fix for old MongoDB versions
    delete req.body._id;
    // Update version before save
    versions.add(config, req.body, function(data) {
        config.findOneAndUpdate({type: req.params.type}, data)
            .then(
                function onSuccess(oldObject) {
                    // Check if siteHome exists in the req object
                    if (!req.body.data.hasOwnProperty('siteHome')) {
                        return;
                    }

                    if (oldObject.data.siteHome !== req.body.data.siteHome._id) {
                        // The homepage has been updated
                        MenuController.setHomepage(req.body.data.siteHome);
                        return;
                    }
                },
                function onError(updateError) {
                    res.status(400).json({err: updateError});
                    return updateError;
                }
            ).then(
                function onSuccess(err) {
                    if(!err) {
                        return readOne(req, res, next);
                    }
                }
            );
    });
};

'use strict';

require('rootpath')();
var _ = require('lodash'),
    ObjectId = require('mongoose').Types.ObjectId,
    Config = require('app/models/config'),
    Taxonomy = require('app/models/taxonomy'),
    multiLanguage = require('app/helpers/multiLanguage');

exports.allTaxonomy = function (req, res, next) {
    Taxonomy.find({$query: {}, $orderby: {safeLabel: 1}}, {label: 1, safeLabel: 1, uuid: 1})
        .exec(function(err, items) {
            if(!err && items) {
                res.status(200).json(items);
            } else {
                res.status(400).json({err: err});
            }
        });
};

exports.allTags = function (req, res, next) {

    Config.findOne({type: "settings"}, {versions: 0})
    .exec(function(err, settings) {
        if(!err && settings) {
            // var labelparam = 'tags.label.' + defaultLanguage;
            Taxonomy.find({$query: {}}, { labelparam : 1, 'tags' : 1, 'label' : 1})
                .exec(function(err, items) {

                    if(!err && items) {

                        var labels = [];
                        _.forEach(items, function(item, i){
                            _.forEach(item.tags, function(tag, i) {
                                var ttt = tag.label;
                                labels.push({
                                    _id: tag._id,
                                    _uuid: tag.uuid,
                                    list: item.label,
                                    label: ttt
                                });
                            });
                        });

                        res.status(200).json(labels);
                    } else {
                        res.status(400).json({err: err});
                    }
                });

        } else {
            res.status(400).json({err: err});
        }
    });


};


exports.getTagsById = function (termRef) {

    function convertToObjectId(item) {
        return new ObjectId(item);
    }

    termRef = _.map(termRef, convertToObjectId);

    return Taxonomy.aggregate([{
        $unwind: '$tags'
    }, {
        $match: {
            'tags._id': {
                $in: termRef
            }
        }
    }, {
        $group: {
            _id: null,
            tags: {
                $addToSet: '$tags'
            }
        }
    }]).exec();
};

/**
 * @api {get} /api/taxonomy Get taxonomy lists with tags
 * @apiGroup Taxonomy
 * @apiVersion 0.0.1
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.read = function (req, res, next) {
    Taxonomy.find({})
        .exec(function(err, read) {
            if(!err && read) {
                res.status(200).json(read);
            } else {
                res.status(400).json({err: err});
            }
        });
};

/**
 * @api {get} /api/taxonomy/:id Get one taxonomy list with tags
 * @apiGroup Taxonomy
 * @apiVersion 0.0.1
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.readOne = function (req, res, next) {

    var listid = req.params.id;

    Taxonomy.findOne({'uuid': listid})
        .exec(function(err, read) {
            if(!err && read) {
                res.status(200).json(read);
            } else {
                res.status(400).json({err: err});
            }
        });
};

function updateSafeLabels(item) {

    item.safeLabel = _.snakeCase(item.label);
    if(!item.tags) {
        item.tags = [];
    } else {
        _.map(item.tags, function(i, index){
            i.safeLabel = _.snakeCase(i.label.en);
        });
    }
}

/**
 * @api {put} /api/taxonomy/:id Update taxonomy list
 * @apiGroup Taxonomy
 * @apiVersion 0.0.1
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.update = function (req, res, next) {
    // Compatibility fix for old MongoDB versions
    delete req.body._id;

    var listid = req.params.id;

    updateSafeLabels(req.body);
    Taxonomy.findOneAndUpdate({'uuid': listid}, req.body, { new : true })
        .exec(function(err, update) {
            if(!err && update) {
                res.status(200).json(update);
            } else {
                res.status(400).json({err: err});
            }
        });
};

/**
 * @api {delete} /api/taxonomy/:id Delete taxonomy list
 * @apiGroup Taxonomy
 * @apiVersion 0.0.1
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.delete = function (req, res, next) {

    var listid = req.params.id;

    Taxonomy.findOne({'uuid': listid})
        .remove()
        .exec(function(err, result) {
            if(!err && result) {
                res.status(200).json(result);
            } else {
                res.status(400).json({err: err});
            }
        });
};

/**
 * @api {post} /api/taxonomy Create new taxonomy list
 * @apiGroup Taxonomy
 * @apiVersion 0.0.1
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.create = function (req, res, next) {

    updateSafeLabels(req.body);
    Taxonomy.create(req.body, function(err, create) {
        if(!err && create) {
            res.status(201).json(create);
        } else {
            res.status(400).json({err: err});
        }
    });
};


/**
 * @api {get} /:language/api/taxonomy/term/:uuid Get term info
 * @apiGroup Taxonomy
 * @apiVersion 0.0.1
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
 exports.getTerm = function (req, res, next) {
     var _termUuid = req.params.uuid;
     Taxonomy.find({'tags.uuid': _termUuid})
        .then(
            function onSuccess(response) {
                // Modify the object
                var _response = {
                    tag: _.find(response[0].tags, {'uuid': _termUuid}),
                    list: response[0]
                };

                // Translate the term
                _response = multiLanguage.translate(_response, req.params.language);
                res.status(200).json(_response);
            },
            function onError(responseError) {
                res.status(400).json({err: responseError});
            }
        );
 };

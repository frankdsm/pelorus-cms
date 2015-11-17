'use strict';

require('rootpath')();
var _ = require('lodash'),
    Q = require('q'),
    contentModel = require('app/models/content'),
    pageController = require('app/controllers/pages'),
    taxonomyController = require('app/controllers/taxonomy'),
    fileUploadService = require('app/controllers/services/fileUploadService'),
    versions = require('app/helpers/versions'),
    fields = require('app/helpers/fields'),
    multiLanguage = require('app/helpers/multiLanguage');

/**
 * @api {get} /api/1.0.0/fileupload/ Upload a file
 * @apiGroup Content
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.fileupload = function (req, res, next) {

    var parsed = JSON.parse(req.body.data);
    var filePath = req.file;
    var fieldname = parsed.fieldname;

    fileUploadService.fileupload(filePath, fieldname, function(error, data) {
        if(error) {
            res.status(400).json({err:error});
        } else {
            res.status(200).json(data);
        }
    });
};

/**
 * @api {get} /api/1.0.0/imageupload/ Upload a image
 * @apiGroup Content
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.imageupload = function (req, res, next) {

    var parsed = JSON.parse(req.body.data);
    var filePath = req.file;
    var fieldname = parsed.fieldname;
    var mimetype = req.mimeType;

    fileUploadService.imageupload(filePath, fieldname, mimetype, function(error, data) {
        if(error) {
            res.status(400).json({err:error});
        } else {
            res.status(200).json(data);
        }
    });
};

// Set published dates based on published status
function setPublishDate(published, dates) {
    _.forEach(published, function(v, k) {
        if(v) {
            if(!dates.hasOwnProperty(k)) {
                dates[k] = new Date();
            }
        } else {
            delete dates[k];
        }
    });
    return dates;
}

// 'Populate' the taxonomy terms
function populateTaxonomyTermsForFields(item) {

    var deferred = Q.defer();

    // 1. Find all taxonomy fields
    var taxonomyFieldIds = _.result(_.find(item.meta.contentType.fields, {type: 'taxonomy'}), '_id');

    if (taxonomyFieldIds) {
        // Convert to array if only one result
        if (_.isString(taxonomyFieldIds)) {
            taxonomyFieldIds = [taxonomyFieldIds];
        }

        // Loop over every field
        var totalFields = taxonomyFieldIds.length;
        var fieldsPopulated = 0;

        _.forEach(taxonomyFieldIds, function(fieldId) {
            // Pluck the ID's
            //var terms = _.pluck(item.fields[fieldId], '_id');
            var terms = item.fields[fieldId];

            // Fetch the tags by reference ID
            taxonomyController.getTagsById(terms).then(
                function onSuccess(response) {
                    if (_.isEmpty(response)) {
                        deferred.resolve();
                    } else {
                        item.fields[fieldId] = response[0].tags;
                        fieldsPopulated += 1;

                        if (totalFields === fieldsPopulated) {
                            deferred.resolve(response);
                        }
                    }
                }, function onError(responseError) {
                    deferred.reject(responseError);
                });
        });
    } else {
        deferred.resolve();
    }

    return deferred.promise;
}

/**
 * @api {get} /api/1.0.0/content/ Get all content
 * @apiGroup Content
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.read = function (req, res) {
    // Filter which content types may be returned
    if(req.session.hasOwnProperty('profile') && req.session.profile.roles.hasOwnProperty('contentTypes')) {
        // Filter content types
        var filter = [];
        _.forEach(req.session.profile.roles.contentTypes, function(ct) {
            if(ct.permissions.read) {
                filter.push(ct.type);
            }
        });
        contentModel.find({'meta.deleted': false, 'meta.contentType': {$in: filter}}, {versions: 0})
            .populate('meta.contentType meta.lastEditor')
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
 * @api {get} /api/1.0.0/content/published/:lang Get all published content in one language
 * @apiGroup Content
 * @apiVersion 1.0.0
 *
 * @apiParam {String} lang Language
 *
 * @apiSuccessExample {Array} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.published = function (req, res, next) {
    var query = {
            deleted: false,
        };
    query['meta.published.' + req.params.lang] = true;
    contentModel.find(query, {versions: 0})
        .exec(function(err, items) {
            if(!err && items) {
                res.status(200).json(items);
            } else {
                res.status(400).json({err: err});
            }
        });
};

/**
 * @api {get} /api/1.0.0/content/:type/type Get all content of one type
 * @apiParam {String} type Content String (safeLabel)
 * @apiGroup Content
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.readType = function (req, res) {
    contentModel.find({safeLabel: new RegExp(req.params.type, 'i'), 'meta.deleted': false}, {versions: 0})
        .exec(function(err, items) {
            if(!err && items) {
                res.status(200).json(items);
            } else {
                res.status(400).json({err: err});
            }
        });
};

/**
 * @api {get} /api/1.0.0/content/:uuid/readone Get a single content document
 * @apiParam {String} uuid Content uuid
 * @apiGroup Content
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.readOne = function (req, res) {
    contentModel.findOne({uuid: req.params.id, 'meta.deleted': false}, {versions: 0})
        .populate('meta.contentType')
        .exec(function(err, item) {
            if(!err && item) {
                res.status(200).json(item);
            } else {
                res.status(400).json({err: err});
            }
        });
};

/**
 * @api {get} /api/1.0.0/content/:uuid Get a single content document
 * @apiParam {String} uuid Content uuid
 * @apiGroup Content
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.readOnePopulated = function (req, res) {
    contentModel.findOne({uuid: req.params.id, 'meta.deleted': false}, {versions: 0})
        .populate('meta.contentType')
        .exec(function(err, item) {
            if(!err && item) {

                // Get meta tags
                taxonomyController.getTagsById(item.meta.taxonomy.tags).then(
                    function onSuccess(response) {
                        if (response.length > 0) {
                            item.meta.taxonomy.tags = response[0].tags;
                            // Get Custom Field tags
                            populateTaxonomyTermsForFields(item).then(
                                function onSuccess(response) {
                                    res.status(200).json(item);
                                },
                                function onError(responseError) {
                                    res.status(404).json({ err : responseError });
                                }
                            );
                        } else {
                            res.status(200).json(item);
                        }
                    }, function onError(responseError) {
                        res.status(400).json(responseError);
                    });

                // Get Custom Field tags
                /*populateTaxonomyTerms(item).then(function() {
                    res.status(200).json(item);
                });*/
            } else {
                res.status(404).json({err: err});
            }
        });
};

/**
 * @api {get} /api/1.0.0/content/:uuid/translated Get a single content document translated
 * @apiParam {String} uuid Content uuid
 * @apiGroup Content
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.translated = function (req, res, next) {

    contentModel.findOne({uuid: req.params.id, 'meta.deleted': false}, {versions: 0})
        .lean()
        .exec(function(err, item) {
            if(!err && item) {
                res.status(200).json(multiLanguage.translate(item, req.session.language));
            } else {
                res.status(404).json({err: err});
            }
        });
};

/**
 * @ api {get} /api/1.0.0/content/:uuid/published Get a single published content document
 * @ apiParam {String} uuid Content uuid
 * @ apiGroup Content
 * @ apiVersion 0.0.1
 *
 * @ apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.publishedOne = function (req, res) {
    contentModel.findOne({uuid: req.params.id, 'meta.deleted': false}, {versions: 0})
        .exec(function(err, item) {
            if(!err && item) {
                if(item.meta.published[req.params.lang]) {
                    res.status(200).json(item);
                } else {
                    res.status(406).json({});
                }
            } else {
                res.status(404).json({err: err});
            }
        });
};

/**
 * @api {post} /api/1.0.0/content Create a new content item
 * @apiGroup Content
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.create = function (req, res, next) {
    req.body.meta.lastEditor = req.session.profile._id.toString();
    req.body.meta.publishDate = setPublishDate(req.body.meta.published, req.body.meta.publishDate);

    if(req.body.meta.taxonomy && req.body.meta.taxonomy.tags) {
        if(typeof req.body.meta.taxonomy.tags[0] === 'object') {
            req.body.meta.taxonomy.tags = _.pluck(req.body.meta.taxonomy.tags, "_id");
        }
    }

    contentModel.create(req.body, function(err, createdItem) {
        if(!err && createdItem) {
            // Add item to Solr
            if (createdItem.meta.hasDetail) {

                // Population of profile
                createdItem.meta.lastEditor = req.session.profile;
                //createdItem.meta.lastEditor = req.session.profile;

                pageController.createPageFromContent(createdItem).then(
                    function onSuccess(response) {
                        res.status(201).json(createdItem);
                    }, function onError(responseError) {
                        res.status(400).json({err: responseError});
                    }
                );
            } else {
                res.status(201).json(createdItem);
            }
        } else {
            res.status(400).json({err: err});
        }
    });
};

/**
 * @api {put} /api/1.0.0/content/:uuid Update a content document
 * @apiParam {String} uuid Content uuid
 * @apiGroup Content
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.update = function (req, res, next) {
    // Compatibility fix for old MongoDB versions
    delete req.body._id;
    // Update version before save
    versions.create(Content, req.body, function(data) {
        //data.meta.lastEditor = req.session.profile._id.toString();
        //data.meta.publishDate = setPublishDate(data.meta.published, data.meta.publishDate);

        // Clear content that will be automatically updated
        delete data.meta.lastModified;

        if(req.body.meta.taxonomy && req.body.meta.taxonomy.tags) {
            if(typeof req.body.meta.taxonomy.tags[0] === 'object') {
                req.body.meta.taxonomy.tags = _.pluck(req.body.meta.taxonomy.tags, "_id");
            }
        }

        contentModel.update({uuid: req.params.id}, data)
            .exec(function(err, update) {
                if(!err && update) {
                    contentModel.findOne({uuid: req.params.id}, {versions: 0})
                        .populate('meta.lastEditor')
                        .lean()
                        .exec(function(err, content) {
                            if(!err && content) {
                                // Get tags
                                //populateTaxonomyTerms(content).then(function() {
                                    // Create detail page if needed
                                    if (content.meta.hasDetail) {
                                        pageController.createPageFromContent(content).then(
                                            function onSuccess() {
                                                res.status(201).json(content);
                                            }, function onError(responseError) {
                                                res.status(400).json({err: responseError});
                                            }
                                        );
                                    } else {
                                        // Delete the detailPage
                                        pageController.deletePageFromContent(content).then(
                                            function onSuccess() {
                                                res.status(201).json(content);
                                            }, function onError(responseError) {
                                                res.status(400).json({err: responseError});
                                            }
                                        );
                                    }

                                    //res.status(200).json(content);
                                //});
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
 * @api {delete} /api/1.0.0/content/:uuid Delete a content document
 * @apiParam {String} uuid Content uuid
 * @apiGroup Content
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 204 OK
 */
exports.delete = function (req, res) {
    var contentId;

    // Find the contentID first, because we don't have the _id here.
    contentModel.findOne({uuid: req.params.id}, {_id: 1})
        .then(
            function onSuccess(response) {
                contentId = response._id;
                return response._id;
            }
        )
        .then(
            function deleteContent() {
                return contentModel.update({uuid: req.params.id},
                            { $set: { meta: { deleted: true } } }).exec();
            }
        )
        .then(
            // This should be uuid
            function removeRelatedPage() {
                var _contentRef = {
                    '_id': contentId
                };
                return pageController.deletePageFromContent(_contentRef);
            }
        )
        .then(
            function onSuccess() {
                res.status(204).json({});
            },
            function onError(responseError) {
                res.status(400).json({err: responseError});
            }
        );
};

// Evaluate the operator for String fields
var evaluateStringCondition = function evaluateStringCondition(condition) {
    var stringEvaluation;

    switch (condition.operator.value) {
        case 'starts with': stringEvaluation = {$regex: '^' + condition.value};
        break;

        case 'ends with': stringEvaluation = {$regex: condition.value + '$'};
        break;

        case 'contains': stringEvaluation = {$regex: condition.value, $options: 'i'};
        break;

        default:
        break;
    }

    return stringEvaluation;
};

// Evaluate the operator for Int fields
var evaluateIntCondition = function evaluateIntCondition(condition) {
    var intEvaluation;

    switch (condition.operator.value) {
        case 'greater than': intEvaluation = {$gt: condition.value};
        break;

        case 'greater than or equals': intEvaluation = {$gte: condition.value};
        break;

        case 'lower than': intEvaluation = {$lt: condition.value};
        break;

        case 'lower than or equals': intEvaluation = {$lte: condition.value};
        break;

        case 'equals': intEvaluation = condition.value;
        break;

        default:
        break;
    }

    return intEvaluation;
};

// Evaluate the operator for Int fields
var evaluateArrayCondition = function evaluateArrayCondition(condition) {
    var arrayEvaluation;

    switch (condition.operator.value) {
        case 'contains all': arrayEvaluation = {$all: condition.value};
        break;

        case 'contains none': arrayEvaluation = {$not: {$all: condition.value}};
        break;

        default:
        break;
    }

    return arrayEvaluation;
};

// Evaluate the operator for Int fields
var evaluateSelectCondition = function evaluateSelectCondition(condition) {
    var selectEvaluation;

    switch (condition.operator.value) {
        case 'is': selectEvaluation = condition.value;
        break;

        case 'is not': selectEvaluation = {$ne: condition.value};
        break;

        default:
        break;
    }

    return selectEvaluation;
};


var populateContent = function populateContent(item) {
    var _deferred = Q.defer();

    pageController.readOneByContentRef(item._id)
        .then(
            function onSuccess(response) {
                item.page = response;

                _deferred.resolve(item);
            },
            function onError(responseError) {
                _deferred.reject(responseError);
            }
        );

    return _deferred.promise;
};

var populateContentWithPage = function populateContentWithPage(content) {
    var _promises = [];

    _.forEach(content, function(item) {
        _promises.push(populateContent(item));
    });

    return Q.all(_promises);
};

// Populate the fields of the content
var populateFields = function populateFields(content) {

    var _promises = [];

    _.forEach(content, function(item) {
        _promises.push(fields.populateFields(item));
    });

    return Q.all(_promises);
};


exports.viewsQuery = function (params, lang) {
    // Compose the query object
    var query = {};
    query['meta.deleted'] = false;

    if(lang !== undefined) {
        query['meta.activeLanguages'] = {$all: [lang]};
    }

    // Query Content Type
    if(_.isObject(params.contentType)) {
        query['meta.contentType'] = params.contentType._id.toString();
    } else {
        query['meta.contentType'] = params.contentType;
    }

    // Field Conditions
    _.forEach(params.conditions, function (condition) {
        var prefix = 'fields.';
        if(condition.field.group === 'Meta') {
            prefix = 'meta.';
        }

        switch (condition.field.dataType) {
            case 'string': query[prefix + condition.field._id] = evaluateStringCondition(condition);
                break;

            case 'int': query[prefix + condition.field._id] = evaluateIntCondition(condition);
                break;

            case 'array':
                // Temporary fix!
                var filter = '';
                if(prefix === 'meta.') {
                    filter = '.tags';
                }
                query[prefix + condition.field._id + filter] = evaluateArrayCondition(condition);
                break;

            case 'datetime': query[prefix + condition.field._id] = evaluateIntCondition(condition);
                break;

            case 'date': query[prefix + condition.field._id] = evaluateIntCondition(condition);
                break;

            case 'option': query[prefix + condition.field._id] = evaluateSelectCondition(condition);
                break;

            case 'object': query[prefix + condition.field._id] = evaluateSelectCondition(condition);
                break;

        }
    });

    var orderby = {
        skip: params.options.offset,
        limit: params.options.limit,
        sort: {}
    };

    if(params.options.orderby) {
        var sortlab = params.options.orderby.group.toLowerCase() + "." + params.options.orderby._id;
        var sortval = (params.options.order ? params.options.order : "") + "1";

        orderby.sort[sortlab] = sortval;
    }

    return contentModel.find(query, {versions: 0}, orderby)
        .populate('meta.contentType meta.lastEditor')
        .lean()
        .then(
            populateContentWithPage,
            function onError(responseError) {
            }
        )
        .then(
            function onSuccess(contentItems) {
                return populateFields(contentItems);
            },
            function onError(responseError) {

            }
        )
        .then(
            function onSuccess(response) {
                return response;
            },
            function onError(responseError) {
            }
        );
};

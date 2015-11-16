'use strict';

require('rootpath')();
var _ = require('lodash'),
    roleModel = require('app/models/role'),
    security = require('app/helpers/security/roles');

/**
 * @api {get} /api/1.0.0/role Get all roles
 * @apiGroup Role
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *       "name": "admin",
 *       "_id": "xxxxxxxxxxxxxxxxxxxxxxxx"
 *     }]
 */
exports.read = function (req, res, next) {
    roleModel.find({deleted: false})
        .populate('contentTypes.type')
        .lean()
        .exec(function(err, items) {
            if(!err && items) {
                res.status(200).json(items);
            } else {
                res.status(400).json({err: err});
            }
        });
};

/**
 * @api {get} /api/1.0.0/role/all Get all roles for overview
 * @apiGroup Role
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.all = function (req, res, next) {
    var result = {
            roles: [],
            contentTypes: [],
            operations: []
        };
    roleModel.find({deleted: false})
        .populate('contentTypes.type')
        .lean()
        .exec(function(err, items) {
            if(!err && items) {
                // Loop over all roles
                _.forEach(items, function(role) {
                    // Add roles to special array
                    result.roles.push({name: role.name, isAdmin: role.isAdmin});
                    // Loop over all content types inside role
                    _.forEach(role.contentTypes, function(ct) {
                        // Loop over all permissions
                        var contentType = _.findIndex(result.contentTypes, function(rct) {
                            return rct.safeLabel === ct.type.meta.safeLabel;
                        });
                        // Add new content type if it does not exists
                        if(!~contentType) {
                            result.contentTypes.push({
                                label: ct.type.meta.label,
                                safeLabel: ct.type.meta.safeLabel,
                                permissions: []
                            });
                            // Set contentType to last added contentType in result array
                            contentType = result.contentTypes.length-1;
                        }
                        // Loop over all the permissions
                        _.forEach(ct.permissions, function(v, k) {
                            // Find if label is already available with permission
                            var permission = _.findIndex(result.contentTypes[contentType].permissions, function(p) {
                                return p.permission === k;
                            });
                            // Permission does not exists, add it
                            if(!~permission) {
                                result.contentTypes[contentType].permissions.push({
                                    permission: k,
                                    roles: [{
                                        name: role.name,
                                        allowed: v
                                    }]
                                });
                            } else {
                                // Item exits, find if role is missing
                                var findRole = _.findIndex(result.contentTypes[contentType].permissions[permission].roles, function(r) {
                                    return r.name === role.name;
                                });
                                // Role should be missing, add new role to array of roles
                                if(!~findRole) {
                                    result.contentTypes[contentType].permissions[permission].roles.push({name: role.name, allowed: v});
                                }
                            }
                        });
                    });

                    // Loop over all operation inside role
                    _.forEach(role.operations, function(op) {
                        // Loop over all permissions
                        var operation = _.findIndex(result.operations, function(rop) {
                            return rop.safeLabel === op.type;
                        });
                        // Add new content type if it does not exists
                        if(!~operation) {
                            result.operations.push({
                                label: _.capitalize(op.type),
                                safeLabel: op.type,
                                permissions: []
                            });
                            // Set operation to last added operation in result array
                            operation = result.operations.length-1;
                        }
                        // Loop over all the permissions
                        _.forEach(op.permissions, function(v, k) {
                            // Find if label is already available with permission
                            var permission = _.findIndex(result.operations[operation].permissions, function(p) {
                                return p.permission === k;
                            });
                            // Permission does not exists, add it
                            if(!~permission) {
                                result.operations[operation].permissions.push({
                                    permission: k,
                                    roles: [{
                                        name: role.name,
                                        allowed: v
                                    }]
                                });
                            } else {
                                // Item exits, find if role is missing
                                var findRole = _.findIndex(result.operations[operation].permissions[permission].roles, function(r) {
                                    return r.name === role.name;
                                });
                                // Role should be missing, add new role to array of roles
                                if(!~findRole) {
                                    result.operations[operation].permissions[permission].roles.push({name: role.name, allowed: v});
                                }
                            }
                        });
                    });
                });
                // Sort roles
                result.roles = _.sortBy(result.roles, 'name');
                // Sort all roles inside content types
                _.forEach(result.contentTypes, function(ct) {
                    _.forEach(ct.permissions, function(p) {
                        p.roles = _.sortBy(p.roles, 'name');
                    });
                });
                // Sort all roles inside operations
                _.forEach(result.operations, function(op) {
                    _.forEach(op.permissions, function(p) {
                        p.roles = _.sortBy(p.roles, 'name');
                    });
                });
                // delete result.roles;
                // delete result.contentTypes;
                res.status(200).json(result);
            } else {
                res.status(400).json({err: err});
            }
        });
};

/**
 * @api {get} /api/1.0.0/role/:uuid Get a single role
 * @apiParam {String} uuid Role uuid.
 * @apiGroup Role
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "name": "admin",
 *       "_id": "xxxxxxxxxxxxxxxxxxxxxxxx"
 *     }
 */
exports.readOne = function (req, res, next) {
    roleModel.findOne({uuid: req.params.id, deleted: false})
        .populate('contentTypes.type')
        .lean()
        .exec(function(err, item) {
            if(!err && item) {
                res.status(200).json(item);
            } else {
                res.status(404).json({err: err});
            }
        });
};

/**
 * @api {post} /api/1.0.0/role Create a new role
 * @apiGroup role
 * @apiVersion 1.0.0
 *
 * @apiSuccess (200) {String} name Name.
 * @apiSuccess (200) {String} description Description of the role.
 * @apiSuccess (200) {String} uuid Unique uuid.
 * @apiSuccess (200) {String} id Mongo _id.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "name": "Editor",
 *       "description": "Lorem Ipsum",
 *       "uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
 *       "id": "xxxxxxxxxxxxxxxxxxxxxxxx"
 *     }
 */
exports.create = function (req, res, next) {
    security.addAllRoles(function(err, data) {
        req.body.contentTypes = data.contentTypes;
        req.body.operations = data.operations;
        roleModel.create(req.body, function(err, create) {
            if(!err && create) {
                res.status(201).json(create);
            } else {
                res.status(400).json({err: err});
            }
        });
    });
};

/**
 * @api {put} /api/1.0.0/role/:uuid Update a role
 * @apiParam {String} uuid Role uuid.
 * @apiGroup Role
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "name": "admin",
 *       "_id": "xxxxxxxxxxxxxxxxxxxxxxxx"
 *     }
 */
exports.update = function (req, res, next) {
    // Compatibility fix for old MongoDB versions
    delete req.body._id;

    roleModel.update({uuid: req.params.id}, req.body)
        .exec(function(err, update) {
            if(!err && update) {
                roleModel.findOne({uuid: req.params.id})
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
 * @api {put} /api/1.0.0/role/one Update a single role
 * @apiGroup Role
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     { }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 417 Error updating the role.
 *     { }
 */
exports.updateOne = function (req, res, next) {
    // Update role
    function updateRole(role) {
        _.forEach(role.contentTypes, function(ct) {
            ct.type = ct.type._id.toString();
        });

        // Compatibility fix for old MongoDB versions
        delete role._id;

        roleModel.update({uuid: role.uuid}, role)
            .exec(function(err, update) {
                if(update) {
                    res.status(200).json({});
                } else {
                    res.status(417).json({err: err});
                }
            });
    }

    // Find operation
    function findOperation(role) {
        var index = _.findIndex(role.operations, function(op) {
            return req.body.label === op.type;
        });
        if(~index) {
            role.operations[index].permissions[req.body.permission] = req.body.allowed;
            updateRole(role);
        } else {
            res.status(417).json({err: 'Role not found'});
        }
    }

    // Find content type
    function findContentType(role) {
        var index = _.findIndex(role.contentTypes, function(ct) {
            return req.body.label === ct.type.meta.safeLabel;
        });
        if(~index) {
            role.contentTypes[index].permissions[req.body.permission] = req.body.allowed;
            updateRole(role);
        } else {
            findOperation(role);
        }
    }

    // Find role
    (function findRole() {
        roleModel.findOne({name: req.body.role})
            .populate('contentTypes.type')
            .lean()
            .exec(function(err, role) {
                if(!err && role) {
                    findContentType(role);
                } else {
                    res.status(417).json({err: err});
                }
            });
    })();
};

/**
 * @api {delete} /api/1.0.0/role/:uuid Delete a role
 * @apiParam {String} uuid Role uuid
 * @apiGroup role
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 204 OK
 */
exports.delete = function (req, res, next) {
    roleModel.update({uuid: req.params.id},
                    {$set: {deleted: true}})
        .exec(function(err, update) {
            if(update) {
                res.status(204).json({});
            } else {
                res.status(400).json({err: err});
            }
        });
};

'use strict';

require('rootpath')();
var _ = require('lodash'),
    q = require('q'),
    menuModel = require('app/models/menu'),
    multiLanguage = require('app/helpers/multiLanguage');

// Get menu (promise)
var readMenu = function() {
    return menuModel.findOne({active: true}).exec();
};
exports.readMenu = readMenu;

/**
 * @api {get} /api/1.0.0/menu Get menu
 * @apiGroup Menu
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
var read = function(req, res, next) {
    readMenu()
        .then(
            function onSuccess(menu) {
                res.status(200).json(menu);
            },
            function onError(err) {
                res.status(400).json({err: err});
            }
        );
};
exports.read = read;

function getRootPage(callback) {
    menuModel.findOne({active: true})
        .populate('menu.data.content')
        .lean()
        .exec(function(err, menu) {
            if(!err && menu) {
                //console.log(menu);
                //var newmenu = getJstreeFormatting(menu.menu);
                var root = _.find(menu.menu, function(item) {
                    return item.parent === "#";
                });

                //console.log(root.data.content);
                if(root) {
                    callback(false, root.data.content);
                } else {
                    callback(true, null);
                }
            } else {
                callback(true, null);
            }
        });
}
exports.getRootPage = getRootPage;

function getJstreeFormatting(menu) {
    var newMenu = _.forEach(menu, function(item, index) {
                    if(item.data) {
                        if(item.data.content && item.data.content.meta) {
                            item.text = item.data.content.meta.label;
                        }
                        if (item.data.content) {
                            item.data.content = item.data.content._id;
                        }
                    }
                });
    return newMenu;
}

/**
 * @api {get} /api/1.0.0/menu/:id/jstree Get menu for jstree library
 * @apiGroup Menu
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.jstreeGet = function (req, res, next) {
    menuModel.findOne({active: true})
        .populate('menu.data.content')
        .select('menu.id menu.parent menu.text menu.data menu.state')
        .lean()
        .exec(function(err, menu) {
            if(!err && menu) {
                res.status(200).json(getJstreeFormatting(menu.menu));
            } else {
                res.status(400).json({err: err});
            }
        });
};

/**
 * @api {put} /api/1.0.0/menu/:id/jstree Update menu from jstree library
 * @apiGroup Menu
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.jstreeUpdate = function (req, res, next) {

    var menuid = req.params.id;
    var body = req.body;

    var mapped = _.map(body, function(item) {
        return {
            id : item.id,
            text : item.text,
            state : item.state,
            data : item.data,
            parent : item.parent
        };
    });

    menuModel.findOneAndUpdate({'_id': menuid, active: true},
        {'$set':
            { 'menu': mapped },
    }, { new : true }, function(err, model) {
        if(!err && model) {
            var newmenu = getJstreeFormatting(model.menu);
            res.status(200).json(newmenu);
        } else {
            res.status(400).json({err: err});
        }
    });
};

/**
 * @api {get} /api/1.0.0/menu/translated/:lang Get translated menu
 * @apiGroup Menu
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
exports.translated = function (req, res, next) {
    var finalMenu = [];

    // Find in final result
    function find(result, item) {
        // Loop over the children
        _.forEach(result, function(r) {
            // If the parent is found, add it to its children
            if(r.id === item.parent) {
                r.children.push(item);
            } else if(r.children.length > 0) {
                // Parent was not found but it has children, call the same function again
                r.children = find(r.children, item);
            }
        });
        return result;
    }

    // Create nested tree of menu
    function createTree(menu) {
        // Loop over each menu item
        _.forEach(menu.menu, function(m) {
            // Set empty array for children
            m.children = [];
            // Push to menu if parent item
            if(m.parent === '#') {
                finalMenu.push(m);
            } else {
                // Find parent
                finalMenu = find(finalMenu, m);
            }
        });
        menu.menu = finalMenu;
        res.status(200).json(finalMenu);
    }

    // Manipulate data
    function manipulate(menu) {
        // Translate menu
        menu = multiLanguage.translate(menu, req.params.lang);
        _.forEach(menu.menu, function(m) {
            // Check for title
            if(m.data.content.meta.hasOwnProperty('title')) {
                m.title = m.data.content.meta.title;
            }
            // Check for slug
            if(m.data.content.meta.hasOwnProperty('slug')) {
                m.slug = m.data.content.meta.slug;
            } else {
                // Set default slug
                m.slug = '/';
            }
            // Remove clutter
            delete m.text;
            delete m.data;
        });
        createTree(menu);
        // res.status(200).json(menu);
    }

    menuModel.findOne({active: true})
        .populate('menu.data.content')
        .lean()
        .exec(function(err, menu) {
            if(!err && menu) {
                manipulate(menu);
            } else {
                res.status(400).json({err: err});
            }
        });
};

/**
 * @api {put} /api/1.0.0/menu/ Update menu
 * @apiGroup Menu
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
var update = function (req, res, next) {
    // Compatibility fix for old MongoDB versions
    delete req.body._id;

    menuModel.findOneAndUpdate({active: true}, req.body, {new: true})
        .exec(function(err, update) {
            if(!err && update) {
                res.status(200).json(update);
            } else {
                res.status(400).json({err: err});
            }
        });
};
exports.update = update;

// Swap out the root element of the menu structure
exports.setHomepage = function setHomepage(page) {
    menuModel.findOne({active: true})
        .then(
            function onSuccess(response) {
                var _root = _.find(response.menu, {parent: "#"});
                if(_root !== undefined) {
                    _root.data.content = page._id;
                    _root.text = page.meta.label;
                } else {
                    _root = {
                        parent: "#",
                        text: page.meta.label,
                        id: "j1_1",
                        data: {
                            content: page._id.toString()
                        },
                        state: {
                            opened: true
                        }
                    };
                    response.menu.push(_root);
                }
                // Compatibility fix for old MongoDB versions
                delete response._id;

                return menuModel.update({}, response);
            },
            function onError(responseError) {

            }
        );
};

// Remove a page from the menu
// @return promise
exports.removePage = function removePage(pageId) {
    var _deferred = q.defer();

    menuModel.findOne({active: true})
        .then(
            function onSuccess(response) {
                // Search for the page in the menu
                var _removed = _.remove(response.menu, function(item) {
                    return item.data.content === pageId;
                });

                if (!_.isEmpty(_removed)) {
                    // Move everything underneath by one level
                    response.menu = _.map(response.menu, function(item) {
                        _.forEach(_removed, function(_removedItem) {
                            if (item.parent === _removedItem.id) {
                                item.parent = _removedItem.parent;
                            }
                        });
                        return item;
                    });
                }

                // Compatibility fix for old MongoDB versions
                delete response._id;

                return menuModel.update({}, response)
                    .exec(function(err, data) {
                        if (!err) {
                            _deferred.resolve();
                        } else {
                            _deferred.reject();
                        }
                    });
            },
            function onError(responseError) {
                _deferred.reject({err: responseError});
            }
        );

    return _deferred.promise;
};

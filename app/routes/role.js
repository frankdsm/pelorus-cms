'use strict';

require('rootpath')();
var roleController = require('app/controllers/roles'),
    config = require('config/config'),
    baseUrl = config.api.prefix + config.api.version + 'role';

module.exports = function(app) {
    app.route(baseUrl).get(roleController.read);
    app.route(baseUrl + '/all').get(roleController.all);
    app.route(baseUrl + '/:id').get(roleController.readOne);
    app.route(baseUrl).post(roleController.create);
    app.route(baseUrl + '/one').put(roleController.updateOne);
    app.route(baseUrl + '/:id').put(roleController.update);
    app.route(baseUrl + '/:id').delete(roleController.delete);
};

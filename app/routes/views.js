'use strict';

require('rootpath')();
var viewController = require('app/controllers/views'),
    config = require('config/config'),
    baseUrl = config.api.prefix + config.api.version + 'view';

module.exports = function(app) {
    app.route(baseUrl).get(viewController.read);
    app.route(baseUrl + '/:id').get(viewController.readOne);

    app.route(baseUrl).post(viewController.create);
    app.route(baseUrl + '/:id').put(viewController.update);
    app.route(baseUrl + '/:id').delete(viewController.delete);

    app.route(baseUrl + '/preview').post(viewController.preview);
    app.route(baseUrl + '/preview/:type').get(viewController.previewContentType);
};

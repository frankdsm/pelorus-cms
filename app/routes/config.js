'use strict';

require('rootpath')();
var configController = require('app/controllers/config'),
    config = require('config/config'),
    baseUrl = config.api.prefix + config.api.version + 'config';

module.exports = function(app) {
    app.route(baseUrl + '/:type').get(configController.readOne);
    app.route(baseUrl + '/:type').put(configController.update);
};

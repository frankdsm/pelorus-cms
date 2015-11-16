'use strict';

require('rootpath')();
var ConfigController = require('app/controllers/config'),
    config = require('config/config'),
    baseUrl = config.api.prefix + config.api.version + 'config';

module.exports = function(app) {
    app.route(baseUrl + '/:type').get(ConfigController.readOne);
    app.route(baseUrl + '/:type').put(ConfigController.update);
};

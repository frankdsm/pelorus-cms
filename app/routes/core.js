'use strict';

require('rootpath')();
var coreController = require('app/controllers/core'),
    sessionController = require('app/controllers/session'),
    config = require('config/config'),
    baseUrl = config.api.prefix + config.api.version + 'session';

module.exports = function(app) {
    app.route('/env').get(coreController.env);
    app.route(baseUrl).get(sessionController.getLanguage);
    app.route(baseUrl).put(sessionController.setLanguage);
};

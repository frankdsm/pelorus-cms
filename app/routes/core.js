'use strict';

require('rootpath')();
var CoreController = require('app/controllers/core'),
    SessionController = require('app/controllers/session'),
    path = require('path'),
    config = require('config/config'),
    baseUrl = path.sep + config.api.prefix + config.api.version + 'session';

module.exports = function(app) {
    app.route('/env').get(CoreController.env);
    app.route(baseUrl).get(SessionController.getLanguage);
    app.route(baseUrl).put(SessionController.setLanguage);
};

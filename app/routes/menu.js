'use strict';

require('rootpath')();
var menuController = require('app/controllers/menu'),
    config = require('config/config'),
    baseUrl = config.api.prefix + config.api.version + 'menu';

module.exports = function(app){
    app.route(baseUrl).get(menuController.read);
    app.route(baseUrl).put(menuController.update);
    app.route(baseUrl + '/:id/jstree').get(menuController.jstreeGet);
    app.route(baseUrl + '/:id/jstree').put(menuController.jstreeUpdate);
    app.route(baseUrl + '/translated/:lang').get(menuController.translated);
};

'use strict';

require('rootpath')();
var contentTypeController = require('app/controllers/contentTypes'),
    config = require('config/config'),
    baseUrl = config.api.prefix + config.api.version + 'type';

module.exports = function(app){
    app.route(baseUrl).get(contentTypeController.read);
    app.route(baseUrl + '/all').get(contentTypeController.allTypes);
    app.route(baseUrl + '/:id').get(contentTypeController.readOne);
    app.route(baseUrl).post(contentTypeController.create);
    app.route(baseUrl + '/:id').put(contentTypeController.update);
    app.route(baseUrl + '/:id').delete(contentTypeController.delete);
};

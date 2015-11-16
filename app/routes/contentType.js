'use strict';

require('rootpath')();
var typesController = require('app/controllers/contentTypes'),
    config = require('config/config'),
    baseUrl = config.api.prefix + config.api.version + 'type';

module.exports = function(app){
    app.route(baseUrl).get(typesController.read);
    app.route(baseUrl + '/all').get(typesController.allTypes);
    app.route(baseUrl + '/:id').get(typesController.readOne);
    app.route(baseUrl).post(typesController.create);
    app.route(baseUrl + '/:id').put(typesController.update);
    app.route(baseUrl + '/:id').delete(typesController.delete);
};

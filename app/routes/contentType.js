'use strict';

require('rootpath')();
var TypesController = require('app/controllers/contentTypes'),
    config = require('config/config'),
    baseUrl = config.api.prefix + config.api.version + 'type';

module.exports = function(app){
    app.route(baseUrl).get(TypesController.read);
    app.route(baseUrl + '/all').get(TypesController.allTypes);
    app.route(baseUrl + '/:id').get(TypesController.readOne);
    app.route(baseUrl).post(TypesController.create);
    app.route(baseUrl + '/:id').put(TypesController.update);
    app.route(baseUrl + '/:id').delete(TypesController.delete);
};

'use strict';

require('rootpath')();
var exampleController = require('app/controllers/examples'),
    config = require('config/config'),
    baseUrl = config.api.prefix + config.api.version + 'example';

module.exports = function(app){
    app.route(baseUrl).get(exampleController.read);
    app.route(baseUrl + '/:id').get(exampleController.readOne);
    app.route(baseUrl).post(exampleController.create);
    app.route(baseUrl + '/:id').put(exampleController.update);
    app.route(baseUrl + '/:id').delete(exampleController.delete);
};

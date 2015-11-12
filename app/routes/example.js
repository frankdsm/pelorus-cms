'use strict';

require('rootpath')();
var ExampleController = require('app/controllers/examples'),
    path = require('path'),
    config = require('config/config'),
    baseUrl = path.sep + config.api.prefix + config.api.version + 'example';

module.exports = function(app){
    app.route(baseUrl).get(ExampleController.read);
    app.route(baseUrl + '/:id').get(ExampleController.readOne);
    app.route(baseUrl).post(ExampleController.create);
    app.route(baseUrl + '/:id').put(ExampleController.update);
    app.route(baseUrl + '/:id').delete(ExampleController.delete);
};

'use strict';

require('rootpath')();
var fieldTypeController = require('app/controllers/fieldTypes'),
    config = require('config/config'),
    baseUrl = config.api.prefix + config.api.version + 'field';

module.exports = function(app){
    app.route(baseUrl).get(fieldTypeController.read);
    app.route(baseUrl + '/:id').get(fieldTypeController.readOne);
};

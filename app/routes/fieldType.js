'use strict';

require('rootpath')();
var FieldTypesController = require('app/controllers/fieldTypes'),
    config = require('config/config'),
    baseUrl = config.api.prefix + config.api.version + 'field';

module.exports = function(app){
    app.route(baseUrl).get(FieldTypesController.read);
    app.route(baseUrl + '/:id').get(FieldTypesController.readOne);
};

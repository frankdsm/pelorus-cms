'use strict';

require('rootpath')();
var languageController = require('app/controllers/languages'),
    config = require('config/config'),
    baseUrl = config.api.prefix + config.api.version + 'language';

module.exports = function(app){
    app.route(baseUrl).get(languageController.read);
    app.route(baseUrl + '/active').get(languageController.readActive);
    app.route(baseUrl + '/:id').get(languageController.readOne);
    app.route(baseUrl + '/:id').put(languageController.update);
};

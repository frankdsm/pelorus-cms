'use strict';

require('rootpath')();
var LanguagesController = require('app/controllers/languages'),
    config = require('config/config'),
    baseUrl = config.api.prefix + config.api.version + 'language';

module.exports = function(app){
    app.route(baseUrl).get(LanguagesController.read);
    app.route(baseUrl + '/active').get(LanguagesController.readActive);
    app.route(baseUrl + '/:id').get(LanguagesController.readOne);
    app.route(baseUrl + '/:id').put(LanguagesController.update);
};

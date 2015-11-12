'use strict';

require('rootpath')();
var languagesController = require('app/controllers/languages'),
    config = require('config/config'),
    baseUrl = config.api.prefix + config.api.version + 'language';

module.exports = function(app){
    app.route(baseUrl).get(languagesController.read);
    app.route(baseUrl + '/active').get(languagesController.readActive);
    app.route(baseUrl + '/:id').get(languagesController.readOne);
    app.route(baseUrl + '/:id').put(languagesController.update);
};

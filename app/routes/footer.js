'use strict';

require('rootpath')();
var FooterController = require('app/controllers/footer'),
    config = require('config/config'),
    baseUrl = config.api.prefix + config.api.version + 'footer';

module.exports = function(app){
    app.route(baseUrl).get(FooterController.read);
    app.route(baseUrl + '/:id').put(FooterController.update);
    app.route(baseUrl + '/translated/:lang').get(FooterController.translated);
};

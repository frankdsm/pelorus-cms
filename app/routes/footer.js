'use strict';

require('rootpath')();
var footerController = require('app/controllers/footer'),
    config = require('config/config'),
    baseUrl = config.api.prefix + config.api.version + 'footer';

module.exports = function(app){
    app.route(baseUrl).get(footerController.read);
    app.route(baseUrl + '/:id').put(footerController.update);
    app.route(baseUrl + '/translated/:lang').get(footerController.translated);
};

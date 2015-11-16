'use strict';

require('rootpath')();
var taxonomyController = require('app/controllers/taxonomy'),
    config = require('config/config'),
    baseUrl = config.api.prefix + config.api.version + 'taxonomy';

//To do: add member validation
module.exports = function(app) {
    app.route(baseUrl).get(taxonomyController.read);
    app.route(baseUrl + "/allTaxonomy").get(taxonomyController.allTaxonomy);
    app.route(baseUrl + "/allTags").get(taxonomyController.allTags);

    app.route(baseUrl + "/:id").get(taxonomyController.readOne);
    app.route(baseUrl).post(taxonomyController.create);
    app.route(baseUrl + "/:id").put(taxonomyController.update);
    app.route(baseUrl + "/:id").delete(taxonomyController.delete);

    app.route(baseUrl + '/term/:language/:uuid').get(taxonomyController.getTerm);
};

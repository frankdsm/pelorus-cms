'use strict';

require('rootpath')();
var TaxonomyController = require('app/controllers/taxonomy'),
    config = require('config/config'),
    baseUrl = config.api.prefix + config.api.version + 'taxonomy';

//To do: add member validation
module.exports = function(app) {
    app.route(baseUrl).get(TaxonomyController.read);
    app.route(baseUrl + "/allTaxonomy").get(TaxonomyController.allTaxonomy);
    app.route(baseUrl + "/allTags").get(TaxonomyController.allTags);

    // /api/taxonomy/:id Get one taxonomy list with tags
    app.route(baseUrl + "/:id").get(TaxonomyController.readOne);
    app.route(baseUrl).post(TaxonomyController.create);
    app.route(baseUrl + "/:id").put(TaxonomyController.update);
    app.route(baseUrl + "/:id").delete(TaxonomyController.delete);

    // /:language/api/taxonomy/term/:id Get a taxonomy term and its parent context by uuid
    app.route('/:language' + baseUrl + '/term/:uuid').get(TaxonomyController.getTerm);
};

'use strict';

require('rootpath')();
var taxonomy = require('app/controllers/taxonomy'),
    config = require('config/config'),
    baseUrl = config.api.prefix + config.api.version + 'taxonomy';

//To do: add member validation
module.exports = function(app) {
    app.route(baseUrl).get(taxonomy.read);
    app.route(baseUrl + "/allTaxonomy").get(taxonomy.allTaxonomy);
    app.route(baseUrl + "/allTags").get(taxonomy.allTags);

    // /api/taxonomy/:id Get one taxonomy list with tags
    app.route(baseUrl + "/:id").get(taxonomy.readOne);
    app.route(baseUrl).post(taxonomy.create);
    app.route(baseUrl + "/:id").put(taxonomy.update);
    app.route(baseUrl + "/:id").delete(taxonomy.delete);

    // /:language/api/taxonomy/term/:id Get a taxonomy term and its parent context by uuid
    app.route('/:language' + baseUrl + '/term/:uuid').get(taxonomy.getTerm);
};

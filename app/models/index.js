'use strict';

require('rootpath')();
var _ = require('lodash'),
    glob = require('glob'),
    path = require('path');

module.exports = function(app) {
    // Load all models
    var models = glob('app/models/**/*.js', {
        sync: true
    });

    // Require each model
    _.forEach(models, function(model) {
        if(path.basename(model) !== 'index.js') {
            require(path.resolve(model));
        }
    });
};

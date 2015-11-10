'use strict';

require('rootpath')();
var _ = require('lodash'),
    glob = require('glob'),
    path = require('path'),
    baseUrl = '/';

module.exports = function(app) {
    // Load all routes
    var routes = glob('./app/routes/**/*.js', {
        sync: true
    });

    // Require each route
    _.forEach(routes, function(route) {
        if(path.basename(route) !== 'index.js') {
            require('app/routes/'+path.basename(route))(app);
        }
    });

    // Fallback route
    app.route(baseUrl).all(function(req, res, next) {
        res.send('Fallback route.');
    });
};

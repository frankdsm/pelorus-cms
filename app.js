'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

require('rootpath')();
var app = require('express')(),
    config = require('config/config');

// Setup database connection
require('app/middleware/db');

// Setup extra stuff for express
require('app/middleware/express')(app);

// Load all routes
require('app/routes')(app);

// Start the server
app.listen(config.port, function () {
    console.log('Pelorus app listening at http://localhost:%s running in %s mode.', config.port, process.env.NODE_ENV);
});

exports = module.exports = app;

'use strict';

require('rootpath')();
var CoreController = require('app/controllers/core');

module.exports = function(app) {
    app.route('/env').get(CoreController.env);
};

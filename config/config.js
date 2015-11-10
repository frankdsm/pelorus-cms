'use strict';

var _ = require('lodash'),
    mode = process.env.NODE_ENV || 'development';

module.exports = _.merge(
    require(__dirname + '/env/all.js'),
    require(__dirname + '/env/' + mode.toLowerCase() + '.js') || {}
);

'use strict';

require('rootpath')();
var mongoose = require('mongoose'),
    config = require('config/config'),
    path = require('path');

mongoose.connect(config.mongo.url + path.sep + config.mongo.db);

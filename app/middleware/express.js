'use strict';

require('rootpath')();
var express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    helmet = require('helmet'),
    swig = require('swig'),
    path = require('path'),
    passport = require('passport'),
    session = require('express-session'),
    mongoStore = require('connect-mongo')({
        session: session
    }),
    config = require('config/config');

module.exports = function(app) {
    // View engine setup
    app.engine('html', swig.renderFile);
    app.set('view engine', 'html');

    // Load social config
    require('app/helpers/social/index.js');

    app.use(passport.initialize());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());

    // Set static folder
    app.use(express.static(path.join(process.cwd(), '/public')));

    // Use express session
    app.use(session({
        saveUninitialized: false,
        resave: true,
        cookie: {
            secure: false,
            httpOnly: false,
            domain: config.session.domain,
            maxAge: config.session.cookieExpiration
        },
        name: config.session.name,
        secret: config.session.secret,
        store: new mongoStore({
            url: config.mongo.url + path.sep + config.mongo.db,
            collection: config.session.collection
        })
    }));

    // Using helmet to make app more secure
    app.use(helmet.xframe());
    app.use(helmet.xssFilter());
    app.use(helmet.nosniff());
    app.use(helmet.ienoopen());
    app.disable('x-powered-by');
};

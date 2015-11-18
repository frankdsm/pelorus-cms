'use strict';

require('rootpath')();
var passport = require('passport'),
    loginController = require('app/controllers/login'),
    config = require('config/config'),
    successUrl = config.frontend + config.authentication.success,
    errorUrl = config.frontend + config.authentication.error;

module.exports = function(app) {
    //Twitter authentication
    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            failureRedirect: errorUrl
        }),
        function(req, res) {
            loginController.authorize(req.user, 'twitter', function(update) {
                if (update) {
                    res.redirect(successUrl);
                } else {
                    res.redirect(errorUrl);
                }
            });
        }
    );

    //Google authentication
    app.get('/auth/google', passport.authenticate('google', {
        scope: 'https://www.googleapis.com/auth/plus.login'
    }));
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            failureRedirect: errorUrl
        }),
        function(req, res) {
            loginController.authorize(req.user, 'google', function(update) {
                if (update) {
                    res.redirect(successUrl);
                } else {
                    res.redirect(errorUrl);
                }
            });
        }
    );
};

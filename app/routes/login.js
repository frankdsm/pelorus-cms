'use strict';

require('rootpath')();
var passport = require('passport'),
    loginController = require('app/controllers/login');

module.exports = function(app) {
    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {failureRedirect: '/error'}),
        function(req, res) {
            loginController.user(req.user, 'twitter', function(update) {
                if(update) {
                    res.redirect('/success');
                } else {
                    res.redirect('/error');
                }
            });
        }
    );

    // Change this to a route in angular
    app.get('/success', function(req, res) {
        res.send('You\'re logged in!');
    });

    // Change this to a route in angular
    app.get('/error', function(req, res) {
        res.send('Something went wrong :\'(!');
    });
};

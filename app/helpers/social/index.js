'use strict';

require('rootpath')();
var passport = require('passport'),
    twitterStrategy = require('passport-twitter').Strategy,
    googleStrategy = require('passport-google-oauth').OAuth2Strategy,
    config = require('config/config');

(function() {
    //Configure twitter authentication
    passport.use(
        new twitterStrategy({
            consumerKey: config.twitter.key,
            consumerSecret: config.twitter.secret,
            callbackURL: config.domain + 'auth/twitter/callback',
            passReqToCallback: true
        }, function(req, token, tokenSecret, profile, done) {
            process.nextTick(function() {
                return done(null, profile);
            });
        }));

    //Configure google authentication
    passport.use(
        new googleStrategy({
            clientID: config.google.key,
            clientSecret: config.google.secret,
            callbackURL: config.domain + 'auth/google/callback',
        }, function(accessToken, refreshToken, profile, done) {
            process.nextTick(function() {
                return done(null, profile);
            });
        }));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });
})();

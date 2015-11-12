'use strict';

require('rootpath')();
var passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    config = require('config/config');

(function(){
    passport.use(
        new TwitterStrategy({
            consumerKey: config.twitter.key,
            consumerSecret: config.twitter.secret,
            callbackURL: config.domain + 'auth/twitter/callback',
            passReqToCallback: true
        }, function(req, token, tokenSecret, profile, done) {
            process.nextTick(function () {
                return done(null, profile);
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });
})();

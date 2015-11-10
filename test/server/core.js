'use strict';

require('rootpath')();

var supertest = require('supertest'),
    expect = require('chai').expect,
    config = require('config/config');

// Set the NODE_ENV to test
process.env.NODE_ENV = 'test';

// Start the application
require('../../app.js');

// API setup
var api = supertest('http://localhost:' + config.port);

describe('Core', function() {
    describe('GET /env', function () {
        it('should return the current environment', function (done) {
            api.get('/env')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body).to.be.an('object');
                    expect(res.body.env).to.be.equal('test');
                    done();
                });
        });
    });
});

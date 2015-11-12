'use strict';

require('rootpath')();
var supertest = require('supertest'),
    expect = require('chai').expect,
    path = require('path'),
    mongoose = require('mongoose');

// Set the NODE_ENV to test
process.env.NODE_ENV = 'test';

// Start the application
require('../../app.js');

// Require config after setting environment
var config = require('config/config');

// API setup
var api = supertest('http://localhost:' + config.port),
    endpoint = path.sep + config.api.prefix + config.api.version + 'example';

describe('Example API tests', function() {
    function createExample(postData, callback) {
        api.post(endpoint)
            .send(postData)
            .end(function onCreate(err, res) {
                callback(err, res.body);
            });
    }

    /**
    * Create example
    */
    describe('POST /examples', function onDescribe() {
        it('should create a example', function onIt(done) {
            var postData = {
                    property: 'value'
                };
            api.post(endpoint)
                .send(postData)
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function validate(err, res) {
                    expect(res.body.property).to.equal(postData.property);
                    done(err);
                });
        });

        it('should return a bad request when no params were provided', function onIt(done) {
            var postData = {};

            api.post(endpoint)
                .send(postData)
                .expect('Content-Type', /json/)
                .expect(400, done);
        });
    });

    /**
    * Read example
    */
    describe('GET /examples/:exampleId', function onDescribe() {
        var example = {};

        beforeEach(function onEach(done) {
            var postData = {
                    property: 'value'
                };
            createExample(postData, function onCreate(err, doc) {
                example = doc;
                done(err);
            });
        });
        it('should return a example', function onIt(done) {
            api.get(endpoint + '/' + example.uuid)
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function validate(err, res) {
                    expect(res.body.uuid).to.equal(example.uuid);
                    expect(res.body.property).to.equal(example.property);
                    done(err);
                });
        });

        it('should return error 404 when example was not found', function onIt(done) {
            api.get(endpoint + '/000000000000000000000000')
                .set('Accept', 'application/json')
                .expect(404, done);
        });
    });

    /**
    * Update example
    */
    describe('PUT /examples/:exampleId', function onDescribe() {
        var example = {};

        beforeEach(function onEach(done) {
            var postData = {
                    property: 'value'
                };
            createExample(postData, function onCreate(err, doc) {
                example = doc;
                done(err);
            });
        });

        it('should return an updated example', function onIt(done) {
            var putData = {
                    property: 'value2'
                };
            api.put(endpoint + '/' + example.uuid)
            .send(putData)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function validate(err, res) {
                expect(res.body.uuid).to.equal(example.uuid);
                expect(res.body.property).to.equal(putData.property);
                done(err);
            });
        });
    });

    /**
    * Delete example
    */
    describe('DELETE /examples/:exampleId', function onDescribe() {
        var example = {};

        beforeEach(function onEach(done) {
            var postData = {
                    property: 'value'
                };

            createExample(postData, function onCreate(err, doc) {
                example = doc;
                done(err);
            });
        });

        it('should be able to delete a example', function onIt(done) {
            api.delete(endpoint + '/' + example._id)
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function validate(err, res) {
                    var Example = mongoose.model('Example');
                    Example.findOne({uuid: res.body.uuid}, function onFind(error, doc) {
                        expect(doc).to.be.a('null');
                        done(error);
                    });
                });
        });
    });

    /**
    * List all examples
    */
    describe('GET /examples', function onDescribe() {
        it('should return examples array', function onIt(done) {
            api.get(endpoint)
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function validate(err, res) {
                    expect(res.body).to.be.an('array');
                    done(err);
                });
        });
    });
});

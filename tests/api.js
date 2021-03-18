const request = require('supertest');
const app = require('../server')
var assert = require('assert');

describe('GET /hello', function() {
    it('whithout params', function(done) {
        request(app.server)
            .get('/hello')
            .set('Accept', 'plain/text')
            .expect(200)
            .then(res => {
                assert.equal(res.text, '<h1>HELLO WORLD</h1>')
                done();
            })
    });
    it('?name=', function(done) {
        request(app.server)
            .get('/hello?name=Alex')
            .set('Accept', 'plain/text')
            .expect(200)
            .then(res => {
                assert.equal(res.text, '<h1>HELLO Alex</h1>')
                done();
            })
            .catch(err => done(err))
    });
  });

describe('GET /admin', function() {
    it('whithout authorization', function(done) {
        request(app.server)
            .get('/admin')
            .set('Accept', 'plain/text')
            .expect(401, done)
    })
    it('with authorization', function(done) {
        request(app.server)
            .get('/admin')
            .set('Authorization', 'test')
            .set('Accept', 'plain/text')
            .expect(200)
            .then( res => {
                assert.equal(res.text, '<h1>Hello, test</h1>')
                done()
            })
            .catch( err => done(err) )
    })
})

describe('POST /sum', function() {
    it('json request with x=2', function(done) {
        request(app.server)
            .post('/sum')
            .send({x:2})
            .set('Accept', 'application/json')
            .expect(200, {"result": 2} ,done)
    })

    it('json request with x=4', function(done) {
        request(app.server)
            .post('/sum')
            .send({x:4})
            .set('Accept', 'application/json')
            .expect(200, {"result": 6} ,done)

    })

    it('request with x=2', function(done) {
        request(app.server)
            .post('/sum?x=2')
            .set('Accept', 'plain/text')
            .expect(200, {"result": 8} ,done)

    }) 
    
    it('request with x=3', function(done) {
        request(app.server)
            .post('/sum?x=3')
            .set('Accept', 'plain/text')
            .expect(200, {"result": 8} ,done)

    })
})

describe('POST /sort', function() {
    it('request with x=10', function(done) {
        request(app.server)
            .post('/sort?x=10')
            .set('Accept', 'plain/text')
            .expect(200, {"result": [10]} ,done)
    }) 
    it('request with x=5', function(done) {
        request(app.server)
            .post('/sort?x=5')
            .set('Accept', 'plain/text')
            .expect(200, {"result": [5,10]} ,done)
    }) 
    it('request with x=23', function(done) {
        request(app.server)
            .post('/sort?x=23')
            .set('Accept', 'plain/text')
            .expect(200, {"result": [5,10,23]} ,done)
    }) 
})
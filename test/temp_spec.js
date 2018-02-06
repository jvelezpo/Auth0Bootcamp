var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../index');

var expect = chai.expect;

chai.use(chaiHttp);

describe('App', function() {
  describe('/encrypt', function() {
    it('responds with status 200', function(done) {
      chai.request(app)
        .get('/encrypt?password=somevalue')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });

    it('Resultant hashes will be 60 characters long', function(done) {
      chai.request(app)
        .get('/encrypt?password=somevalue')
        .end(function(err, res) {
          expect(res.body.hash).to.have.lengthOf(60);
          done();
        });
    });
  });

  describe('/comparePassAndHash', function() {
    it('responds with a status 200', function(done) {
      chai.request(app)
        .get(`/comparePassAndHash?password=somevalue&hash=${Array(60).join('a')}`)
        .end(function(err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });

    it('responds true with the correct hash', function(done) {
      chai.request(app)
        .get('/encrypt?password=somevalue')
        .end(function(err, res) {
          expect(res.body.hash).to.have.lengthOf(60);
          chai.request(app)
            .get(`/comparePassAndHash?password=somevalue&hash=${res.body.hash}`)
            .end(function(err, res) {
              expect(res.body.success).to.be.true;
              done();
            });
        });
    });

    it('responds false with the incorrect hash', function(done) {
      chai.request(app)
        .get(`/comparePassAndHash?password=somevalue&hash=${Array(60).join('a')}`)
        .end(function(err, res) {
          expect(res.body.success).to.be.false;
          done();
        });
    });
  });
});

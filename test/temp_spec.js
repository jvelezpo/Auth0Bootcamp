var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../index');

var expect = chai.expect;

chai.use(chaiHttp);

describe('App', function() {
  describe('/encrypt?password=somevalue', function() {
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
});

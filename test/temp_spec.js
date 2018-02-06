

var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../index');

var expect = chai.expect;

chai.use(chaiHttp);

describe('App', function() {
  describe('/generateRandom', function(){
    it('should return password with all properties', function(done){
      chai.request(app)
      .get('/generateRandom')
      .end((err,res) => {
      expect(err).to.be.null;
      chai.request(app)
      .get(`/checkStrenght?password=${res.body.password}`)
      .end((err2,res2) => {
          expect(err).to.be.null;
        expect(res).to.have.status(200)
      })
    });
    done();
  });
});
 
  describe('/checkStrenght', function() {
    it('should fail on not having uppercase letter', function(done) {
      chai.request(app)
      .get('/checkStrenght?password=p@ssword123')
      .end((err,res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        expect(res.body.errors).to.include('The password must contain at least one uppercase letter.')
        done();
      })
    });

    it('should fail on not having special character', function(done) {
      chai.request(app)
      .get('/checkStrenght?password=Password123')
      .end((err,res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        expect(res.body.errors).to.include('The password must contain at least one special character.')
        done();
      })
    });

    it('should fail on not having lowercase letter', function(done) {
      chai.request(app)
      .get('/checkStrenght?password=PASSWORD123')
      .end((err,res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        expect(res.body.errors).to.include('The password must contain at least one lowercase letter.')
        done();
      })
    });

    it('should fail on not having one number', function(done) {
      chai.request(app)
      .get('/checkStrenght?password=PASSWORD')
      .end((err,res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        expect(res.body.errors).to.include('The password must contain at least one number.')
        done();
      })
    });

    it('should fail on not having having at least 8 chars', function(done) {
      chai.request(app)
      .get('/checkStrenght?password=PASS')
      .end((err,res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect('Content-Type', /json/);
        expect(res.body.errors).to.include('The password must be at least 8 characters long.')
        done();
      })
    });
  });

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

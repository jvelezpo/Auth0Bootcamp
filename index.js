const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const owasp = require('owasp-password-strength-test');
const generator = require('generate-password');

const saltRounds = 10;

app.get('/', (req, res) => {
  res.json({hello: 'World!'});
});

/**
 * Checks if a password is strong enough
 * @param '/checkStrenght'
 * @param  req, res
 * @return JSON object
 */
app.get('/checkStrenght', (req, res) => {
  if (!req.query.password) {
    res.json({error: 'There is no password query!'});
  } else {
    owasp.config({
      allowPassphrases       : true,
      maxLength              : 128,
      minLength              : 8,
      minPhraseLength        : 20,
      minOptionalTestsToPass : 4,
    });
    
    res.send(owasp.test(req.query.password));
  }
});

/**
 * Encrypt a string with bcrypt hash method
 * @param '/encrypt'
 * @param  req, res
 * @return JSON object
 */
app.get('/encrypt', (req, res) => {
  if (!req.query.password) {
    res.json({error: 'There is no password query!'});
  } else {
    bcrypt.hash(req.query.password, saltRounds, function(err, hash) {
      res.json({hash});
    });
  }
});

/**
 * Compare if a password and a hash belong to each other
 * @param '/comparePassAndHash'
 * @param  req, res
 * @return JSON object
 */
app.get('/comparePassAndHash', (req, res) => {
  if (!req.query.password && !req.query.hash) {
    res.json({error: 'There is no password or hash query!'});
  } else {
    res.json({success: bcrypt.compareSync(req.query.password, req.query.hash)});
  }
});

/**
 * Compare if a password and a hash belong to each other
 * @param '/comparePassAndHash'
 * @param  req, res
 * @return JSON object
 */
app.get('/generateRandom', (req, res) => {
  const password = generator.generate({
    length: Math.floor(Math.random() * 128) + 10,
    numbers: true,
    symbols: true,
    uppercase: true,
    strict: true
  });
  res.json({password});
});

app.listen(8000, () => console.log('Example app listening on port 8000!'));

module.exports = app;

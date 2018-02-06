const express = require('express');
const app = express();
var bcrypt = require('bcrypt');

const saltRounds = 10;

app.get('/', (req, res) => {
  res.json({hello: 'World!'});
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

app.listen(8000, () => console.log('Example app listening on port 8000!'));

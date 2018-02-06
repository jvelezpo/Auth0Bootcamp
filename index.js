const express = require('express');
const app = express();
var bcrypt = require('bcrypt');

const saltRounds = 10;

app.get('/', (req, res) => {
  res.json({hello: 'World!'});
});

app.get('/encrypt', (req, res) => {
  if (!req.query.password) {
    res.json({error: 'There is no password query!'});
  } else {
    bcrypt.hash(req.query.password, saltRounds, function(err, hash) {
      res.json({hash})
    });
  }
});

app.listen(8000, () => console.log('Example app listening on port 8000!'))
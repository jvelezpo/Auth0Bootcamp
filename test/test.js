var assert = require('assert');

describe('true', function() {
  describe('true', function() {
    it('should assert', function(done) {
      assert.equal(true, true);
      done();
    });
  });
});
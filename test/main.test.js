const assert = require('assert');
const main = require('../main.js');

describe('Main.js Tests', function() {
  describe('#exportedFunction()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });

  describe('#anotherExportedFunction()', function() {
    it('should return the index when the value is present', function() {
      assert.equal([1,2,3].indexOf(2), 1);
    });
  });

  // Add more tests as needed for other functions and variables in main.js
});
var express = require('express');
var router = express.Router();
var request = require('request');

/* GET status page. */
router.get('/status', function(req, res, next) {
  request('http://www.google.com', function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // Show the HTML for the Google homepage.
    }
  })
});

module.exports = router;

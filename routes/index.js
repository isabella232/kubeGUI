var express = require('express');
var router = express.Router();
var request = require('request');
var loginModule = require('../config/loginOptions');

/**
* Checks status of Kubernetes API Server and returns JSON as String (Response)
* @param {Object} req
* @param {Object} res
* @return {String}
*/
router.get('/status', function(req, res) {
  // Clone loginOptions into statusOptions
  var statusOptions = JSON.parse(JSON.stringify(loginModule.options));
  // Set timeout for connection 1 second
  statusOptions.timeout = 1000;
  // Make request and respond this request with 200 (OK) or 503 (Service unavailable)
  request(statusOptions, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.writeHead(200);
      res.end(JSON.stringify({error: false, status: "Successfully connected to Kubernetes"}));
    }
    else {
      res.writeHead(503);
      res.end(JSON.stringify({error: true, status: "Couldn't connect to Kubernetes"}));
    }
  })
});

module.exports = router;

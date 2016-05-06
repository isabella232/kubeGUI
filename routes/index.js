var express = require('express');
var router = express.Router();
var request = require('request');

/* GET status page. */
router.get('/status', function(req, res, next) {
  var statusOptions = JSON.parse(JSON.stringify(options));
  statusOptions.timeout = 1000;
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

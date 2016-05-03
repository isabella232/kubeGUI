var express = require('express');
var router = express.Router();
var request = require('request');

var host = process.env.KUBEGUIHOST || process.env.KUBERNETES_SERVICE_HOST;
var port = process.env.KUBEGUIPORT || process.env.KUBERNETES_SERVICE_PORT || '443';
var username = process.env.KUBEGUIUSERNAME;
var password = process.env.KUBEGUIPASSWORD;
var url = 'https://' + host + ':' + port + '/api/v1';

var options = {
  url: url,
  auth: {
    user: username,
    password: password
  },
  rejectUnauthorized: false,
  timeout: 1000
}

/* GET status page. */
router.get('/status', function(req, res, next) {
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.writeHead(200);
      res.end(JSON.stringify({error: false, status: "Successfully connected to Kubernetes"}));
    }
    else {
      res.writeHead(503);
      res.end(JSON.stringify({error: true, status: "Could not connect to Kubernetes"}));
    }
  })
});

module.exports = router;

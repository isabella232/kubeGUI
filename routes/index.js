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
  rejectUnauthorized: false
}

/* GET status page. */
router.get('/status', function(req, res, next) {
  request(options, function(error, response, body) {
    if (error) {
      console.dir(error)
      return
    }
    console.dir(body)
  })
});

module.exports = router;

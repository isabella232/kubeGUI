module.exports = function(io) {
  var app = require('express');
  var router = app.Router();
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

  io.on('connection', function(socket) {
    socket.on('start', function(data) {
      options.url += '/' + data + '?watch=true'
      request(options).on('response', function(response) {
        var string = '';
        response.on('data', function(chunk) {
          string += chunk
          try {
            JSON.parse(string);
            socket.emit('update', string);
            string = '';
          } catch (e) {
          }
        });
      });
    });
  });

  return router;
}

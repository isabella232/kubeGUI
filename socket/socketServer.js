module.exports = function(io) {
  var app = require('express');
  var router = app.Router();
  var request = require('request');

  io.on('connection', function(socket) {
    socket.on('start', function(data) {
      var socketOptions = JSON.parse(JSON.stringify(options));
      socketOptions.url += '/' + data + '?watch=true'
      request(socketOptions).on('response', function(response) {
        var string = '';
        response.on('data', function(chunk) {
          string += chunk;
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

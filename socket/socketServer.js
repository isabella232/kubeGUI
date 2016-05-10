module.exports = function(io) {
  var app = require('express');
  var router = app.Router();
  var request = require('request');
  var loginModule = require('../config/loginOptions');

  io.on('connection', function(socket) {
    socket.on('start', function(data) {
      // Clone loginOptions into socketOptions
      var socketOptions = JSON.parse(JSON.stringify(loginModule.options));
      // Set right URL with string data from start event (Pods, RC or Services)
      socketOptions.url += '/' + data + '?watch=true'
      request(socketOptions).on('response', function(response) {
        var string = '';
        response.on('data', function(chunk) {
          // When new chunk comes in, append it to the string
          string += chunk;
          try {
            /* If it's valid JSON, send the string to the 
            client and reset the string for the next updates */
            JSON.parse(string);
            socket.emit('update', string);
            string = '';
          } catch (e) {
            // If it isn't valid JSON, do nothing and wait for the next chunk
          }
        });
      });
    });
  });

  return router;
}

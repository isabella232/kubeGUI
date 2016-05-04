module.exports = function(io) {
  var app = require('express');
  var router = app.Router();

  io.on('connection', function(socket) {
    socket.on('test', function(data) {
      console.log(data);
    });
  });

  return router;
}

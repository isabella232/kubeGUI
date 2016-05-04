var express = require('express');
var socket_io = require("socket.io");
var routes = require('./routes/index');

var app = express();

var io = socket_io();
app.io = io;

var host = process.env.KUBEGUIHOST || process.env.KUBERNETES_SERVICE_HOST;
var port = process.env.KUBEGUIPORT || process.env.KUBERNETES_SERVICE_PORT || '443';
var username = process.env.KUBEGUIUSERNAME;
var password = process.env.KUBEGUIPASSWORD;
var url = 'https://' + host + ':' + port + '/api/v1';

options = {
  url: url,
  auth: {
    user: username,
    password: password
  },
  rejectUnauthorized: false
}

var socketServer = require('./socket/socketServer.js')(io);

app.use(express.static('public'));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: err });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  var errorStatus = err.status || 500;
  res.status(errorStatus);
  res.send(errorStatus + ' ' + err.message);
});


module.exports = app;

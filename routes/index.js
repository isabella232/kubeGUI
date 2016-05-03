var express = require('express');
var router = express.Router();

/* GET status page. */
router.get('/status', function(req, res, next) {
  res.end('status');
});

module.exports = router;

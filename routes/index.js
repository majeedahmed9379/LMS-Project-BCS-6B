
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.send("Welcome to LMS by SP19-BCS-6B Home Page");
});

module.exports = router;

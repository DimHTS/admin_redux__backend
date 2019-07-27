var express = require("express");
var fs = require("fs");

var usersData = require("../models/users");


var router = express.Router();

router.get("/users", function (req, res) {
  var data = fs.readFileSync(usersData, "utf8");
  var users = JSON.parse(data);
  res.send(users);
});

module.exports = router;


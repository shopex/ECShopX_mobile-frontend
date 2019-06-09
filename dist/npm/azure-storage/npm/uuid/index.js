var v1 = require("./v1.js");
var v4 = require("./v4.js");

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;
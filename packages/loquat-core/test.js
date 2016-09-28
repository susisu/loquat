/*
 * loquat-core test
 * copyright (c) 2016 Susisu
 */

"use strict";

const path = require("path");

require("app-module-path").addPath(path.join(__dirname, "lib"));

require("./test/utils.js");
require("./test/pos.js");
require("./test/error.js");
require("./test/stream.js");
require("./test/parser.js");

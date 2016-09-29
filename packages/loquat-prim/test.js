/*
 * loquat-prim test
 * copyright (c) 2016 Susisu
 */

"use strict";

const path = require("path");

require("app-module-path").addPath(path.join(__dirname, "lib"));

require("./test/prim.js");

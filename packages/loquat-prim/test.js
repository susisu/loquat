/*
 * loquat-prim test
 * copyright (c) 2016 Susisu
 */

"use strict";

global._core = require("loquat-core")();
global._prim = require("./lib/prim.js")(_core);

require("./test/prim.js");

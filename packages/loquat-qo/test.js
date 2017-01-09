/*
 * loquat-qo test
 */

"use strict";

global._core = require("loquat-core")();
global._qo   = require("./lib/qo.js")(_core);

require("./test/qo.js");

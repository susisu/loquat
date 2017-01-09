/*
 * loquat-prim test
 */

"use strict";

global._core  = require("loquat-core")();
global._prim  = require("./lib/prim.js")(_core);
global._sugar = require("./lib/sugar.js")(_core, _prim);

require("./test/prim.js");
require("./test/sugar.js");

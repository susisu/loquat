/*
 * loquat-combinators test
 */

"use strict";

global._core        = require("loquat-core")();
const _prim         = require("loquat-prim")(_core);
global._combinators = require("./lib/combinators.js")(_core, _prim);
global._sugar       = require("./lib/sugar.js")(_core, _prim, _combinators);

require("./test/combinators.js");
require("./test/sugar.js");

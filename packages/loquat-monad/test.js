/*
 * loquat-monad test
 */

"use strict";

global._core  = require("loquat-core")();
const _prim   = require("loquat-prim")(_core);
global._monad = require("./lib/monad.js")(_core, _prim);
global._sugar = require("./lib/sugar.js")(_core, _monad);

require("./test/monad.js");
require("./test/sugar.js");

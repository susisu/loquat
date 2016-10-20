/*
 * loquat-monad test
 * copyright (c) 2016 Susisu
 */

"use strict";

global._core  = require("loquat-core")();
const _prim   = require("loquat-prim")(_core);
global._monad = require("./lib/monad.js")(_core, _prim);

require("./test/monad.js");

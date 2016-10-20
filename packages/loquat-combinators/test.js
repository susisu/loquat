/*
 * loquat-combinators test
 * copyright (c) 2016 Susisu
 */

"use strict";

global._core        = require("loquat-core")();
const _prim         = require("loquat-prim")(_core);
global._combinators = require("./lib/combinators.js")(_core, _prim);

require("./test/combinators.js");

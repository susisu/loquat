/*
 * loquat-expr test
 * copyright (c) 2016 Susisu
 */

"use strict";

global._core       = require("loquat-core")();
const _prim        = require("loquat-prim")(_core);
const _combinators = require("loquat-combinators")(_core);
global._expr       = require("./lib/expr.js")(_core, _prim, _combinators);

require("./test/expr.js");

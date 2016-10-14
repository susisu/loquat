/*
 * loquat-combinators test
 * copyright (c) 2016 Susisu
 */

"use strict";

global._core        = require("loquat-core")();
global._combinators = require("./lib/combinators.js")(_core);

require("./test/combinators.js");

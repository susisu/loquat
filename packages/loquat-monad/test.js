/*
 * loquat-monad test
 * copyright (c) 2016 Susisu
 */

"use strict";

global._core  = require("loquat-core")();
global._monad = require("./lib/monad.js")(_core);

require("./test/monad.js");

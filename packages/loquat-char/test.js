/*
 * loquat-char test
 * copyright (c) 2016 Susisu
 */

"use strict";

global._core = require("loquat-core")();
const _prim  = require("loquat-prim")(_core);
global._char = require("./lib/char.js")(_core, _prim);

require("./test/char.js");

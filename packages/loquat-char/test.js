/*
 * loquat-char test
 * copyright (c) 2016 Susisu
 */

"use strict";

global._core  = require("loquat-core")();
const _prim   = require("loquat-prim")(_core);
global._char  = require("./lib/char.js")(_core, _prim);
global._sugar = require("./lib/sugar.js")(_core, _char);

require("./test/char.js");
require("./test/sugar.js");

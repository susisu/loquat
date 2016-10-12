/*
 * loquat-char test
 * copyright (c) 2016 Susisu
 */

"use strict";

global._core = require("loquat-core")();
global._char = require("./lib/char.js")(_core);

require("./test/char.js");

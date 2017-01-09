/*
 * loquat-token test
 */

"use strict";

global._core       = require("loquat-core")();
const _prim        = require("loquat-prim")(_core);
const _char        = require("loquat-char")(_core);
const _combinators = require("loquat-combinators")(_core);
global._language   = require("./lib/language.js")();
global._token      = require("./lib/token.js")(_core, _prim, _char, _combinators);

require("./test/language.js");
require("./test/token.js");

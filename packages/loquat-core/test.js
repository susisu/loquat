/*
 * loquat-core test
 * copyright (c) 2016 Susisu
 */

"use strict";

global._utils  = require("./lib/utils.js")();
global._pos    = require("./lib/pos.js")();
global._error  = require("./lib/error.js")(_pos);
global._stream = require("./lib/stream.js")();
global._parser = require("./lib/parser.js")(_pos, _error);

require("./test/utils.js");
require("./test/pos.js");
require("./test/error.js");
require("./test/stream.js");
require("./test/parser.js");

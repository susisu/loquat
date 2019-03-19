"use strict";

const _utils  = require("./lib/utils.js")();
const _pos    = require("./lib/pos.js")();
const _error  = require("./lib/error.js")({ _pos });
const _stream = require("./lib/stream.js")({ _utils });
const _parser = require("./lib/parser.js")({ _pos, _error });

Object.assign(global, { _utils, _pos, _error, _stream, _parser });

require("./test/utils.js");
require("./test/pos.js");
require("./test/error.js");
require("./test/stream.js");
require("./test/parser.js");

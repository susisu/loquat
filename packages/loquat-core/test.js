"use strict";

const _utils  = require("./lib/utils")();
const _pos    = require("./lib/pos")();
const _error  = require("./lib/error")({ _pos });
const _stream = require("./lib/stream")({ _utils });
const _parser = require("./lib/parser")({ _pos, _error });

Object.assign(global, { _utils, _pos, _error, _stream, _parser });

require("./test/utils");
require("./test/pos");
require("./test/error");
require("./test/stream");
require("./test/parser");

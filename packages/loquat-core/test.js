"use strict";

const chai = require("chai");

const _utils  = require("./lib/utils")();
const _pos    = require("./lib/pos")();
const _error  = require("./lib/error")({ _pos });
const _parser = require("./lib/parser")({ _pos, _error });
const _stream = require("./lib/stream")({ _utils });
const _core   = require("./lib/core")({ _utils, _pos, _error, _parser, _stream });

const _test = require("loquat-test")(_core);

Object.assign(global, { _utils, _pos, _error, _stream, _parser, _core, _test });
chai.use(_test.plugin);

require("./test/utils");
require("./test/pos");
require("./test/error");
require("./test/stream");
require("./test/parser");
require("./test/core");

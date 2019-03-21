"use strict";

const chai = require("chai");

const _utils  = require("./lib/utils")();
const _pos    = require("./lib/pos")();
const _error  = require("./lib/error")({ _pos });
const _stream = require("./lib/stream")({ _utils });
const _parser = require("./lib/parser")({ _pos, _error });
const _core   = require("./lib/core")({ _utils, _pos, _error, _stream, _parser });

Object.assign(global, { _utils, _pos, _error, _stream, _parser });
// assuming loquat-test is updated in sync with loquat-core
chai.use(require("../loquat-test")(_core));

require("./test/utils");
require("./test/pos");
require("./test/error");
require("./test/stream");
require("./test/parser");

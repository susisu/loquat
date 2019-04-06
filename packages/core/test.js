"use strict";

const $utils  = require("./lib/utils")();
const $pos    = require("./lib/pos")();
const $error  = require("./lib/error")({ $pos });
const $parser = require("./lib/parser")({ $pos, $error });
const $stream = require("./lib/stream")({ $utils });
const $core   = require("./lib/core")({ $utils, $pos, $error, $parser, $stream });

Object.assign(global, { $utils, $pos, $error, $stream, $parser, $core });

require("./test/utils");
require("./test/pos");
require("./test/error");
require("./test/stream");
require("./test/parser");
require("./test/core");

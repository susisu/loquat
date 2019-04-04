/*
 * loquat-core
 */

"use strict";

module.exports = () => {
  const _utils  = require("./lib/utils")();
  const _pos    = require("./lib/pos")();
  const _error  = require("./lib/error")({ _pos });
  const _parser = require("./lib/parser")({ _pos, _error });
  const _stream = require("./lib/stream")({ _utils });
  const _core   = require("./lib/core")({ _utils, _pos, _error, _parser, _stream });
  return _core;
};

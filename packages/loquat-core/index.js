/*
 * loquat-core
 */

"use strict";

module.exports = () => {
  const _utils  = require("./lib/utils")();
  const _pos    = require("./lib/pos")();
  const _error  = require("./lib/error")({ _pos });
  const _stream = require("./lib/stream")({ _utils });
  const _parser = require("./lib/parser")({ _pos });
  const _core   = require("./lib/core")({ _utils, _pos, _error, _stream, _parser });
  return _core;
};

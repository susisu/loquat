"use strict";

module.exports = _core => {
  const _aux    = require("./lib/aux")({ _core });
  const _assert = require("./lib/assert")({ _core, _aux });
  const _helper = require("./lib/helper")({ _core });

  return {
    plugin: (chai, utils) => {
      _assert(chai, utils);
    },
    helper: _helper,
  };
};

"use strict";

module.exports = _core => {
  const _aux = require("./lib/aux")({ _core });
  const _assert = require("./lib/assert")({ _core, _aux });

  return {
    plugin: (chai, utils) => {
      _assert(chai, utils);
    },
  };
};

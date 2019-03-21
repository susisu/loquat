"use strict";

module.exports = _core => (chai, utils) => {
  const _aux = require("./lib/aux")({ _core });
  const _assert = require("./lib/assert")({ _core, _aux });

  _assert(chai, utils);
};

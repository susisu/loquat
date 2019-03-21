"use strict";

module.exports = _core => (chai, utils) => {
  const aux = require("./lib/aux")(_core);

  require("./lib/assert")(_core, { chai, utils }, aux);
};

"use strict";

module.exports = _core => (chai, utils) => {
  require("./lib/assert")(_core, { chai, utils });
};

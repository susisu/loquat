/*
 * loquat-qo
 */

"use strict";

module.exports = _core => {
  const _qo = require("./lib/qo.js")(_core);

  return Object.freeze({
    qo: _qo.qo,
    do: _qo.qo,
  });
};

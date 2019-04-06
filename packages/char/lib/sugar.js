"use strict";

module.exports = (_core, { _char }) => {
  const { manyChars, manyChars1 } = _char;

  return Object.freeze({
    manyChars() {
      return manyChars(this);
    },
    manyChars1() {
      return manyChars1(this);
    },
  });
};

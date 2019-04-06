"use strict";

module.exports = ($core, { $char }) => {
  const { manyChars, manyChars1 } = $char;

  return Object.freeze({
    manyChars() {
      return manyChars(this);
    },
    manyChars1() {
      return manyChars1(this);
    },
  });
};

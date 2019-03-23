"use strict";

module.exports = ({ _core }) => {
  const { ParseError, Result, StrictParser } = _core;

  function createDummyParser() {
    return new StrictParser(state => Result.efail(ParseError.unknown(state.pos)));
  }

  return Object.freeze({
    createDummyParser,
  });
};

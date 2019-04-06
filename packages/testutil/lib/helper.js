"use strict";

module.exports = ({ $core }) => {
  const { ParseError, Result, StrictParser } = $core;

  function createDummyParser() {
    return new StrictParser(state => Result.efail(ParseError.unknown(state.pos)));
  }

  return Object.freeze({
    createDummyParser,
  });
};

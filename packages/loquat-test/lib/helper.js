"use strict";

module.exports = ({ _core }) => {
  const { ParseError, Result, StrictParser } = _core;

  function createNoopParser() {
    return new StrictParser(state =>
      Result.esucc(
        ParseError.unknown(state.pos),
        undefined,
        state
      )
    );
  }

  return Object.freeze({
    createNoopParser,
  });
};

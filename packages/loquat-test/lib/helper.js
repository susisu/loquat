"use strict";

module.exports = ({ _core }) => {
  const { ParseError, Result, Parser } = _core;

  function createNoopParser() {
    return new Parser(state =>
      Result.esuc(
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

"use strict";

const { expect } = require("chai");

const { ParseError, Result, StrictParser } = _parser;

describe(".constructor", () => {
  it("should create a new `StrictParser` instance", () => {
    const parser = new StrictParser(state =>
      Result.esuc(
        ParseError.unknown(state.pos),
        undefined,
        state
      )
    );
    expect(parser).to.be.an.instanceOf(StrictParser);
  });
});

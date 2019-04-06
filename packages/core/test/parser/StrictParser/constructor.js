"use strict";

const { expect } = require("chai");

const { ParseError, Result, StrictParser } = $parser;

describe(".constructor", () => {
  it("should create a new `StrictParser` instance", () => {
    const parser = new StrictParser(state =>
      Result.esucc(
        ParseError.unknown(state.pos),
        undefined,
        state
      )
    );
    expect(parser).to.be.an.instanceOf(StrictParser);
  });
});

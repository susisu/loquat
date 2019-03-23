"use strict";

const { expect } = require("chai");

const { ParseError, Result, Parser } = _parser;

describe(".constructor", () => {
  it("should create a new `Parser` instance", () => {
    const parser = new Parser(state =>
      Result.esuc(
        ParseError.unknown(state.pos),
        undefined,
        state
      )
    );
    expect(parser).to.be.an.instanceOf(Parser);
  });
});

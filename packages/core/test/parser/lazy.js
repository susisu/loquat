"use strict";

const { expect } = require("chai");

const { ParseError } = $error;
const { Result, StrictParser, LazyParser, lazy } = $parser;

describe("lazy", () => {
  it("should create a new `LazyParser` instance", () => {
    const p = new StrictParser(state => Result.efail(ParseError.unknown(state.pos)));
    const parser = lazy(() => p);
    expect(parser).to.be.an.instanceOf(LazyParser);
    const res = parser.eval();
    expect(res).to.equal(p);
  });
});

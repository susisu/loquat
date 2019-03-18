"use strict";

const { expect } = require("chai");

const { Parser, LazyParser, lazy } = _parser;

describe("lazy", () => {
  it("should create a new `LazyParser` instance", () => {
    const p = new Parser(() => {});
    const parser = lazy(() => p);
    expect(parser).to.be.an.instanceOf(LazyParser);
    const res = parser.eval();
    expect(res).to.equal(p);
  });
});

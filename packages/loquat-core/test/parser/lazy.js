"use strict";

const { expect } = require("chai");

const { LazyParser, lazy } = _parser;

const { createDummyParser } = _test.helper;

describe("lazy", () => {
  it("should create a new `LazyParser` instance", () => {
    const p = createDummyParser();
    const parser = lazy(() => p);
    expect(parser).to.be.an.instanceOf(LazyParser);
    const res = parser.eval();
    expect(res).to.equal(p);
  });
});

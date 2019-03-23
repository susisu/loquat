"use strict";

const { expect } = require("chai");

const { LazyParser, lazy } = _parser;

const { createNoopParser } = _test.helper;

describe("lazy", () => {
  it("should create a new `LazyParser` instance", () => {
    const p = createNoopParser();
    const parser = lazy(() => p);
    expect(parser).to.be.an.instanceOf(LazyParser);
    const res = parser.eval();
    expect(res).to.equal(p);
  });
});

"use strict";

const { expect } = require("chai");

const { Parser, LazyParser } = _parser;

describe(".constructor", () => {
  it("should create a new `LazyParser` instance", () => {
    const parser = new LazyParser(() => new Parser(() => {}));
    expect(parser).to.be.an.instanceOf(LazyParser);
  });
});

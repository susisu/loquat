"use strict";

const { expect } = require("chai");

const { LazyParser } = _parser;

const { createNoopParser } = _test.helper;

describe(".constructor", () => {
  it("should create a new `LazyParser` instance", () => {
    const parser = new LazyParser(() => createNoopParser());
    expect(parser).to.be.an.instanceOf(LazyParser);
  });
});

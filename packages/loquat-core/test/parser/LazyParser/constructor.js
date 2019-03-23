"use strict";

const { expect } = require("chai");

const { LazyParser } = _parser;

const { createDummyParser } = _test.helper;

describe(".constructor", () => {
  it("should create a new `LazyParser` instance", () => {
    const parser = new LazyParser(() => createDummyParser());
    expect(parser).to.be.an.instanceOf(LazyParser);
  });
});

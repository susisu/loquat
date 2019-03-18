"use strict";

const { expect } = require("chai");

const { Parser } = _parser;

describe(".constructor", () => {
  it("should create a new `Parser` instance", () => {
    const parser = new Parser(() => {});
    expect(parser).to.be.an.instanceOf(Parser);
  });
});

"use strict";

const { expect }   = require("chai");

const { StrictParser } = _core;

describe("sugar", () => {
  it("should contain parser extension methods", () => {
    expect(_sugar.manyChars).to.be.a("function");
    expect(_sugar.manyChars.call(
      new StrictParser(() => {})
    )).to.be.a.parser;

    expect(_sugar.manyChars1).to.be.a("function");
    expect(_sugar.manyChars1.call(
      new StrictParser(() => {})
    )).to.be.a.parser;
  });
});

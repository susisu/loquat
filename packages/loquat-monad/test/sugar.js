"use strict";

const { expect }   = require("chai");

const { StrictParser } = _core;

describe("sugar", () => {
  it("should contain parser extension methods", () => {
    expect(_sugar.forever).to.be.a("function");
    expect(_sugar.forever.call(
      new StrictParser(() => {})
    )).to.be.a.parser;

    expect(_sugar.discard).to.be.a("function");
    expect(_sugar.discard.call(
      new StrictParser(() => {})
    )).to.be.a.parser;

    expect(_sugar.void).to.be.a("function");
    expect(_sugar.void.call(
      new StrictParser(() => {})
    )).to.be.a.parser;

    expect(_sugar.join).to.be.a("function");
    expect(_sugar.join.call(
      new StrictParser(() => {})
    )).to.be.a.parser;

    expect(_sugar.when).to.be.a("function");
    expect(_sugar.when.call(
      new StrictParser(() => {}),
      true
    )).to.be.a.parser;

    expect(_sugar.unless).to.be.a("function");
    expect(_sugar.unless.call(
      new StrictParser(() => {}),
      false
    )).to.be.a.parser;

    expect(_sugar.filter).to.be.a("function");
    expect(_sugar.filter.call(
      new StrictParser(() => {}),
      () => {}
    )).to.be.a.parser;
  });
});

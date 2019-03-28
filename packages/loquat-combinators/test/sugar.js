"use strict";

const { expect } = require("chai");

const { StrictParser } = _core;

describe("sugar", () => {
  it("should contain parser extension methods", () => {
    expect(_sugar.option).to.be.a("function");
    expect(_sugar.option.call(
      new StrictParser(() => {}),
      "nyancat"
    )).to.be.a.parser;

    expect(_sugar.optionMaybe).to.be.a("function");
    expect(_sugar.optionMaybe.call(
      new StrictParser(() => {})
    )).to.be.a.parser;

    expect(_sugar.optional).to.be.a("function");
    expect(_sugar.optional.call(
      new StrictParser(() => {})
    )).to.be.a.parser;

    expect(_sugar.between).to.be.a("function");
    expect(_sugar.between.call(
      new StrictParser(() => {}),
      new StrictParser(() => {}),
      new StrictParser(() => {})
    )).to.be.a.parser;

    expect(_sugar.many1).to.be.a("function");
    expect(_sugar.many1.call(
      new StrictParser(() => {})
    )).to.be.a.parser;

    expect(_sugar.skipMany1).to.be.a("function");
    expect(_sugar.skipMany1.call(
      new StrictParser(() => {}),
      new StrictParser(() => {})
    )).to.be.a.parser;
    expect(_sugar.skipMany1.call(
      new StrictParser(() => {})
    )).to.be.a.parser;

    expect(_sugar.sepBy).to.be.a("function");
    expect(_sugar.sepBy.call(
      new StrictParser(() => {}),
      new StrictParser(() => {})
    )).to.be.a.parser;

    expect(_sugar.sepBy1).to.be.a("function");
    expect(_sugar.sepBy1.call(
      new StrictParser(() => {}),
      new StrictParser(() => {})
    )).to.be.a.parser;

    expect(_sugar.sepEndBy).to.be.a("function");
    expect(_sugar.sepEndBy.call(
      new StrictParser(() => {}),
      new StrictParser(() => {})
    )).to.be.a.parser;

    expect(_sugar.sepEndBy1).to.be.a("function");
    expect(_sugar.sepEndBy1.call(
      new StrictParser(() => {}),
      new StrictParser(() => {})
    )).to.be.a.parser;

    expect(_sugar.endBy).to.be.a("function");
    expect(_sugar.endBy.call(
      new StrictParser(() => {}),
      new StrictParser(() => {})
    )).to.be.a.parser;

    expect(_sugar.endBy1).to.be.a("function");
    expect(_sugar.endBy1.call(
      new StrictParser(() => {}),
      new StrictParser(() => {})
    )).to.be.a.parser;

    expect(_sugar.count).to.be.a("function");
    expect(_sugar.count.call(
      new StrictParser(() => {}),
      42
    )).to.be.a.parser;

    expect(_sugar.notFollowedBy).to.be.a("function");
    expect(_sugar.notFollowedBy.call(
      new StrictParser(() => {}),
      new StrictParser(() => {})
    )).to.be.a.parser;
    expect(_sugar.notFollowedBy.call(
      new StrictParser(() => {})
    )).to.be.a.parser;

    expect(_sugar.reduceManyTill).to.be.a("function");
    expect(_sugar.reduceManyTill.call(
      new StrictParser(() => {}),
      new StrictParser(() => {}),
      () => {},
      "nyancat"
    )).to.be.a.parser;

    expect(_sugar.manyTill).to.be.a("function");
    expect(_sugar.manyTill.call(
      new StrictParser(() => {}),
      new StrictParser(() => {})
    )).to.be.a.parser;

    expect(_sugar.skipManyTill).to.be.a("function");
    expect(_sugar.skipManyTill.call(
      new StrictParser(() => {}),
      new StrictParser(() => {}),
      new StrictParser(() => {})
    )).to.be.a.parser;
    expect(_sugar.skipManyTill.call(
      new StrictParser(() => {}),
      new StrictParser(() => {})
    )).to.be.a.parser;
  });
});

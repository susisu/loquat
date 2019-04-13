"use strict";

const { expect } = require("chai");

const { SourcePos, ParseError, Config, State, Result } = $core;

const { createDummyParser } = $helpers;

describe("createDummyParser", () => {
  it("should create a new parser that does nothing", () => {
    const parser = createDummyParser();
    const state = new State(
      new Config({ tabWidth: 4, unicode: true }),
      "input",
      new SourcePos("main", 496, 6, 28),
      "none"
    );
    const res = parser.run(state);
    expect(res).to.be.an.equalResultTo(Result.efail(
      ParseError.unknown(new SourcePos("main", 496, 6, 28))
    ));
  });
});

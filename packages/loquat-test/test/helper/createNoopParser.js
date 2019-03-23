"use strict";

const { expect } = require("chai");

const { SourcePos, ParseError, Config, State, Result } = _core;

const { createNoopParser } = _helper;

describe("createNoopParser", () => {
  it("should create a new parser that does nothing", () => {
    const parser = createNoopParser();
    const state = new State(
      new Config({ tabWidth: 4, unicode: true }),
      "input",
      new SourcePos("main", 496, 6, 28),
      "none"
    );
    const res = parser.run(state);
    expect(res).to.be.an.equalResultTo(Result.esucc(
      ParseError.unknown(new SourcePos("main", 496, 6, 28)),
      undefined,
      state
    ));
  });
});

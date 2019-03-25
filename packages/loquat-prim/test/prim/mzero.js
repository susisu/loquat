"use strict";

const { expect } = require("chai");

const { SourcePos, ParseError, Config, State, Result } = _core;

const { mzero } = _prim;

describe("mzero", () => {
  it("should be a parser that always fails without consumption, with an unknown error", () => {
    expect(mzero).to.be.a.parser;
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    const res = mzero.run(initState);
    expect(res).to.be.an.equalResultTo(Result.efail(
      ParseError.unknown(new SourcePos("main", 0, 1, 1)))
    );
  });
});

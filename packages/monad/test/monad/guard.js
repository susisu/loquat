"use strict";

const { expect } = require("chai");

const {
  SourcePos,
  ParseError,
  Config,
  State,
  Result,
} = $core;

const { guard } = $monad;

describe("guard", () => {
  it("returns a parser that does nothing and succeeds without consumption if the given condition"
    + " is satisfied", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 1, 1),
      "none"
    );
    const parser = guard(true);
    expect(parser).to.be.a.parser;
    const res = parser.run(initState);
    expect(res).to.be.an.equalResultTo(Result.esucc(
      ParseError.unknown(initState.pos),
      undefined,
      initState
    ));
  });

  it("returns a parser that does nothing and fails without consumption if the given condition"
    + " is not satisfied", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 1, 1),
      "none"
    );
    const parser = guard(false);
    expect(parser).to.be.a.parser;
    const res = parser.run(initState);
    expect(res).to.be.an.equalResultTo(Result.efail(ParseError.unknown(initState.pos)));
  });
});

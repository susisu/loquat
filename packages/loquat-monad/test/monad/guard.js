"use strict";

const { expect } = require("chai");

const {
  SourcePos,
  ParseError,
  Config,
  State,
  Result,
} = _core;

const { guard } = _monad;

describe(".guard(cond)", () => {
  it("returns a parser that empty succeeds with undefined if `cond' is `true'", () => {
    const initState = new State(
      new Config({ tabWidth: 8 }),
      "input",
      new SourcePos("foobar", 1, 1),
      "none"
    );
    const parser = guard(true);
    expect(parser).to.be.a.parser;
    const res = parser.run(initState);
    expect(Result.equal(
      res,
      Result.esucc(
        ParseError.unknown(initState.pos),
        undefined,
        initState
      )
    )).to.be.true;
  });

  it("returns a parser that empty fails with undefined if `cond' is `empty fails'", () => {
    const initState = new State(
      new Config({ tabWidth: 8 }),
      "input",
      new SourcePos("foobar", 1, 1),
      "none"
    );
    const parser = guard(false);
    expect(parser).to.be.a.parser;
    const res = parser.run(initState);
    expect(Result.equal(
      res,
      Result.efail(ParseError.unknown(initState.pos))
    )).to.be.true;
  });
});

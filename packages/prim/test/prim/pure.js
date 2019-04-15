"use strict";

const { expect } = require("chai");

const { SourcePos, ParseError, Config, State, Result } = $core;

const { pure } = $prim;

describe("pure", () => {
  it("should create a parser that always succeeds without consumption with the given value", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 1, 1),
      "none"
    );
    const parser = pure("foo");
    expect(parser).to.be.a.parser;
    const res = parser.run(initState);
    expect(res).to.be.an.equalResultTo(Result.esucc(
      ParseError.unknown(new SourcePos("main", 1, 1)),
      "foo",
      initState
    ));
  });
});

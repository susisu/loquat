"use strict";

const { expect } = require("chai");

const { SourcePos, ParseError, Config, State, Result } = _core;

const { getParserState } = _prim;

describe("getParserState", () => {
  it("should be a parser that gets the current parser state", () => {
    expect(getParserState).to.be.a.parser;
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    const res = getParserState.run(initState);
    expect(res).to.be.an.equalResultTo(Result.esucc(
      ParseError.unknown(new SourcePos("main", 0, 1, 1)),
      initState,
      initState
    ));
  });
});

"use strict";

const { expect } = require("chai");

const { SourcePos, ParseError, Config, State, Result } = $core;

const { updateParserState } = $prim;

describe("updateParserState", () => {
  it("should create a parser that updates the current parser state using the specified function and"
    + " succeeds without consumption", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 1, 1),
      "none"
    );
    const newState = new State(
      new Config(),
      "rest",
      new SourcePos("main", 1, 2),
      "some"
    );
    const parser = updateParserState(state => {
      expect(state).to.be.an.equalStateTo(initState);
      return newState;
    });
    expect(parser).to.be.a.parser;
    const res = parser.run(initState);
    expect(res).to.be.an.equalResultTo(Result.esucc(
      ParseError.unknown(newState.pos),
      newState,
      newState
    ));
  });
});

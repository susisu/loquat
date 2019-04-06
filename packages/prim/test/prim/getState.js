"use strict";

const { expect } = require("chai");

const { SourcePos, ParseError, Config, State, Result } = $core;

const { getState } = $prim;

describe("getState", () => {
  it("should be a parser that gets the user-defined state of the current parser state", () => {
    expect(getState).to.be.a.parser;
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    const res = getState.run(initState);
    expect(res).to.be.an.equalResultTo(Result.esucc(
      ParseError.unknown(new SourcePos("main", 0, 1, 1)),
      initState.userState,
      initState
    ));
  });
});

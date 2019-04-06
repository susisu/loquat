"use strict";

const { expect } = require("chai");

const { SourcePos, ParseError, Config, State, Result } = _core;

const { getPosition } = _prim;

describe("getPosition", () => {
  it("should be a parser that gets the position of the current parser state", () => {
    expect(getPosition).to.be.a.parser;
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    const res = getPosition.run(initState);
    expect(res).to.be.an.equalResultTo(Result.esucc(
      ParseError.unknown(new SourcePos("main", 0, 1, 1)),
      initState.pos,
      initState
    ));
  });
});

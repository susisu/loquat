"use strict";

const { expect } = require("chai");

const { SourcePos, ParseError, Config, State, Result } = _core;

const { setPosition } = _prim;

describe("setPosition", () => {
  it("should create a parser that sets the position of the current parser state to the specified"
    + " one and succeeds without consumption", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    const parser = setPosition(new SourcePos("main", 496, 6, 28));
    expect(parser).to.be.a.parser;
    const res = parser.run(initState);
    expect(res).to.be.an.equalResultTo(Result.esucc(
      ParseError.unknown(new SourcePos("main", 496, 6, 28)),
      undefined,
      new State(
        new Config(),
        "input",
        new SourcePos("main", 496, 6, 28),
        "none"
      )
    ));
  });
});

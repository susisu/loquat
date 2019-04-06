"use strict";

const { expect } = require("chai");

const { SourcePos, ParseError, Config, State, Result } = $core;

const { setState } = $prim;

describe("setState", () => {
  it("should create a parser that sets the user-defined state of the current parser state to the"
    + " specified one and succeeds without consumption", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    const parser = setState("some");
    expect(parser).to.be.a.parser;
    const res = parser.run(initState);
    expect(res).to.be.an.equalResultTo(Result.esucc(
      ParseError.unknown(new SourcePos("main", 0, 1, 1)),
      undefined,
      new State(
        new Config(),
        "input",
        new SourcePos("main", 0, 1, 1),
        "some"
      )
    ));
  });
});

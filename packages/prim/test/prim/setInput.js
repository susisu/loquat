"use strict";

const { expect } = require("chai");

const { SourcePos, ParseError, Config, State, Result } = $core;

const { setInput } = $prim;

describe("setInput", () => {
  it("should create a parser that sets the input of the current parser state to the specified one"
    + " and succeeds without consumption", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    const parser = setInput("rest");
    expect(parser).to.be.a.parser;
    const res = parser.run(initState);
    expect(res).to.be.an.equalResultTo(Result.esucc(
      ParseError.unknown(new SourcePos("main", 0, 1, 1)),
      undefined,
      new State(
        new Config(),
        "rest",
        new SourcePos("main", 0, 1, 1),
        "none"
      )
    ));
  });
});

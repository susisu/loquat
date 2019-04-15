"use strict";

const { expect } = require("chai");

const { SourcePos, ParseError, Config, State, Result } = $core;

const { getInput } = $prim;

describe("getInput", () => {
  it("should be a parser that gets the input of the current parser state", () => {
    expect(getInput).to.be.a.parser;
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 1, 1),
      "none"
    );
    const res = getInput.run(initState);
    expect(res).to.be.an.equalResultTo(Result.esucc(
      ParseError.unknown(new SourcePos("main", 1, 1)),
      initState.input,
      initState
    ));
  });
});

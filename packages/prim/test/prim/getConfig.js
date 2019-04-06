"use strict";

const { expect } = require("chai");

const { SourcePos, ParseError, Config, State, Result } = $core;

const { getConfig } = $prim;

describe("getConfig", () => {
  it("should be a parser that gets the config of the current parser state", () => {
    expect(getConfig).to.be.a.parser;
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    const res = getConfig.run(initState);
    expect(res).to.be.an.equalResultTo(Result.esucc(
      ParseError.unknown(new SourcePos("main", 0, 1, 1)),
      initState.config,
      initState
    ));
  });
});

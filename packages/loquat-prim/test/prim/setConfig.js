"use strict";

const { expect } = require("chai");

const { SourcePos, ParseError, Config, State, Result } = _core;

const { setConfig } = _prim;

describe("setConfig", () => {
  it("should create a parser that sets the config of the current parser state to the specified one"
    + " and succeeds without consumption", () => {
    const initState = new State(
      new Config({ unicode: false }),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    const parser = setConfig(new Config({ unicode: true }));
    expect(parser).to.be.a.parser;
    const res = parser.run(initState);
    expect(res).to.be.an.equalResultTo(Result.esucc(
      ParseError.unknown(new SourcePos("main", 0, 1, 1)),
      undefined,
      new State(
        new Config({ unicode: true }),
        "input",
        new SourcePos("main", 0, 1, 1),
        "none"
      )
    ));
  });
});

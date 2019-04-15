"use strict";

const { expect } = require("chai");

const {
  SourcePos,
  ErrorMessageType,
  ErrorMessage,
  StrictParseError,
  Config,
  State,
  Result,
} = $core;

const { fail } = $prim;

describe("fail", () => {
  it("should create a parser that always fails without consumption, with the specified error"
    + " message", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 1, 1),
      "none"
    );
    const parser = fail("foo");
    expect(parser).to.be.a.parser;
    const res = parser.run(initState);
    expect(res).to.be.an.equalResultTo(Result.efail(
      new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "foo")]
      )
    ));
  });
});

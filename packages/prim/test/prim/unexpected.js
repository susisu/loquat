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
} = _core;

const { unexpected } = _prim;

describe("unexpected", () => {
  it("should create a parser that always fails without consumption, with an unexpected"
    + " error", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    const parser = unexpected("foo");
    expect(parser).to.be.a.parser;
    const res = parser.run(initState);
    expect(res).to.be.an.equalResultTo(Result.efail(
      new StrictParseError(
        new SourcePos("main", 0, 1, 1),
        [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
      )
    ));
  });
});

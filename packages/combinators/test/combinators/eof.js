"use strict";

const { expect } = require("chai");

const {
  show,
  SourcePos,
  ErrorMessageType,
  ErrorMessage,
  StrictParseError,
  Config,
  State,
  Result,
} = $core;

const { eof } = $combinators;

describe("eof", () => {
  it("should be a parser that rejects any token", () => {
    expect(eof).to.be.a.parser;
    // empty input
    {
      const initState = new State(
        new Config(),
        "",
        new SourcePos("main", 1, 1),
        "none"
      );
      const res = eof.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
            ErrorMessage.create(ErrorMessageType.EXPECT, "end of input"),
          ]
        ),
        undefined,
        initState
      ));
    }
    // non-empty input
    {
      const initState = new State(
        new Config(),
        "ABC",
        new SourcePos("main", 1, 1),
        "none"
      );
      const res = eof.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.UNEXPECT, show("A")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "end of input"),
          ]
        )
      ));
    }
  });
});

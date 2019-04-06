"use strict";

const { expect } = require("chai");

const {
  show,
  SourcePos,
  ErrorMessageType,
  ErrorMessage,
  ParseError,
  StrictParseError,
  Config,
  State,
  Result,
} = _core;

const { lower } = _char;

describe("lower", () => {
  it("should be a parser that accepts a lowercase letter", () => {
    expect(lower).to.be.a.parser;
    // match
    for (const c of "abcdefghijklmnopqrstuvwxyz") {
      const initState = new State(
        new Config(),
        c + "ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = lower.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 1, 1, 2)),
        c,
        new State(
          initState.config,
          "ABC",
          new SourcePos("main", 1, 1, 2),
          "none"
        )
      ));
    }
    // not match
    {
      const initState = new State(
        new Config(),
        "ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = lower.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "lowercase letter"),
          ]
        )
      ));
    }
    // empty input
    {
      const initState = new State(
        new Config(),
        "",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = lower.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
            ErrorMessage.create(ErrorMessageType.EXPECT, "lowercase letter"),
          ]
        )
      ));
    }
  });
});

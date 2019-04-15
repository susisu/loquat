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
} = $core;

const { upper } = $char;

describe("upper", () => {
  it("should be a parser that accepts an uppercase letter", () => {
    expect(upper).to.be.a.parser;
    // match
    for (const c of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
      const initState = new State(
        new Config(),
        c + "abc",
        new SourcePos("main", 1, 1),
        "none"
      );
      const res = upper.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 1, 2)),
        c,
        new State(
          initState.config,
          "abc",
          new SourcePos("main", 1, 2),
          "none"
        )
      ));
    }
    // not match
    {
      const initState = new State(
        new Config(),
        "abc",
        new SourcePos("main", 1, 1),
        "none"
      );
      const res = upper.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("a")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "uppercase letter"),
          ]
        )
      ));
    }
    // empty input
    {
      const initState = new State(
        new Config(),
        "",
        new SourcePos("main", 1, 1),
        "none"
      );
      const res = upper.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
            ErrorMessage.create(ErrorMessageType.EXPECT, "uppercase letter"),
          ]
        )
      ));
    }
  });
});

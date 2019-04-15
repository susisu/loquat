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

const { digit } = $char;

describe("digit", () => {
  it("should be a parser that parses a decimal digit", () => {
    expect(digit).to.be.a.parser;
    // match
    for (const c of "0123456789") {
      const initState = new State(
        new Config(),
        c + "ABC",
        new SourcePos("main", 1, 1),
        "none"
      );
      const res = digit.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 1, 2)),
        c,
        new State(
          initState.config,
          "ABC",
          new SourcePos("main", 1, 2),
          "none"
        )
      ));
    }
    // not match
    {
      const initState = new State(
        new Config(),
        "ABC",
        new SourcePos("main", 1, 1),
        "none"
      );
      const res = digit.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
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
      const res = digit.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
            ErrorMessage.create(ErrorMessageType.EXPECT, "digit"),
          ]
        )
      ));
    }
  });
});

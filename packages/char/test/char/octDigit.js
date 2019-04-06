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

const { octDigit } = $char;

describe("octDigit", () => {
  it("should be a parser that accepts an octal digit", () => {
    expect(octDigit).to.be.a.parser;
    // match
    for (const c of "01234567") {
      const initState = new State(
        new Config(),
        c + "89A",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = octDigit.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 1, 1, 2)),
        c,
        new State(
          initState.config,
          "89A",
          new SourcePos("main", 1, 1, 2),
          "none"
        )
      ));
    }
    // not match
    {
      const initState = new State(
        new Config(),
        "89A",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = octDigit.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("8")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "octal digit"),
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
      const res = octDigit.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
            ErrorMessage.create(ErrorMessageType.EXPECT, "octal digit"),
          ]
        )
      ));
    }
  });
});

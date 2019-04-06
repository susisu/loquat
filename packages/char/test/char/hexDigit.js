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

const { hexDigit } = _char;

describe("hexDigit", () => {
  it("should be a parser that accepts a hexadecimal digit", () => {
    expect(hexDigit).to.be.a.parser;
    // match
    for (const c of "0123456789ABCDEFabcdef") {
      const initState = new State(
        new Config(),
        c + "GHI",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = hexDigit.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 1, 1, 2)),
        c,
        new State(
          initState.config,
          "GHI",
          new SourcePos("main", 1, 1, 2),
          "none"
        )
      ));
    }
    // not match
    {
      const initState = new State(
        new Config(),
        "GHI",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const res = hexDigit.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("G")),
            ErrorMessage.create(ErrorMessageType.EXPECT, "hexadecimal digit"),
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
      const res = hexDigit.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
            ErrorMessage.create(ErrorMessageType.EXPECT, "hexadecimal digit"),
          ]
        )
      ));
    }
  });
});

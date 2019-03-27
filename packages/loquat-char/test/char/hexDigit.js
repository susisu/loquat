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

describe(".hexDigit", () => {
  it("should return a parser that parses a hexadecimal digit", () => {
    expect(hexDigit).to.be.a.parser;
    // match
    for (const c of "0123456789ABCDEFabcdef") {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        c + "GHI",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = hexDigit.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          ParseError.unknown(new SourcePos("foobar", 1, 2)),
          c,
          new State(
            initState.config,
            "GHI",
            new SourcePos("foobar", 1, 2),
            "none"
          )
        )
      )).to.be.true;
    }
    // not match
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "GHI",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = hexDigit.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("G")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "hexadecimal digit"),
            ]
          )
        )
      )).to.be.true;
    }
    // empty input
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = hexDigit.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.EXPECT, "hexadecimal digit"),
            ]
          )
        )
      )).to.be.true;
    }
  });
});

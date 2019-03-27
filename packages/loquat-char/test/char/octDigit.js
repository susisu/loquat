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

const { octDigit } = _char;

describe(".octDigit", () => {
  it("should return a parser that parses a octal digit", () => {
    expect(octDigit).to.be.a.parser;
    // match
    for (const c of "01234567") {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        c + "ABC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = octDigit.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          ParseError.unknown(new SourcePos("foobar", 1, 2)),
          c,
          new State(
            initState.config,
            "ABC",
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
        "ABC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = octDigit.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "octal digit"),
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
      const res = octDigit.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.EXPECT, "octal digit"),
            ]
          )
        )
      )).to.be.true;
    }
  });
});

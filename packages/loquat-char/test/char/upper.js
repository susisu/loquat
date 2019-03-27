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

const { upper } = _char;

describe(".upper", () => {
  it("should return a parser that parses a uppercase letter", () => {
    expect(upper).to.be.a.parser;
    // match
    for (const c of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        c + "abc",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = upper.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          ParseError.unknown(new SourcePos("foobar", 1, 2)),
          c,
          new State(
            initState.config,
            "abc",
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
        "abc",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = upper.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("a")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "uppercase letter"),
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
      const res = upper.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.EXPECT, "uppercase letter"),
            ]
          )
        )
      )).to.be.true;
    }
  });
});

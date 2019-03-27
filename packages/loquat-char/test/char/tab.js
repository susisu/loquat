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

const { tab } = _char;

describe(".tab", () => {
  it("should return a parser that parses a tab character", () => {
    expect(tab).to.be.a.parser;
    // match
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "\tABC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = tab.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          ParseError.unknown(new SourcePos("foobar", 1, 9)),
          "\t",
          new State(
            initState.config,
            "ABC",
            new SourcePos("foobar", 1, 9),
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
      const res = tab.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "tab"),
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
      const res = tab.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.EXPECT, "tab"),
            ]
          )
        )
      )).to.be.true;
    }
  });
});

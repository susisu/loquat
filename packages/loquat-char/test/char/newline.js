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

const { newline } = _char;

describe(".newline", () => {
  it("should return a parser that parses a newline character (LF)", () => {
    expect(newline).to.be.a.parser;
    // match
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "\nABC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = newline.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          ParseError.unknown(new SourcePos("foobar", 2, 1)),
          "\n",
          new State(
            initState.config,
            "ABC",
            new SourcePos("foobar", 2, 1),
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
      const res = newline.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "new-line"),
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
      const res = newline.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.EXPECT, "new-line"),
            ]
          )
        )
      )).to.be.true;
    }
  });
});

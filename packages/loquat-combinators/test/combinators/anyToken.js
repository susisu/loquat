"use strict";

const { expect } = require("chai");

const {
  SourcePos,
  ErrorMessageType,
  ErrorMessage,
  ParseError,
  StrictParseError,
  Config,
  State,
  Result,
} = _core;

const { anyToken } = _combinators;

describe(".anyToken", () => {
  it("should return a parser that accepts any token", () => {
    expect(anyToken).to.be.a.parser;
    // empty input
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = anyToken.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "")]
          )
        )
      )).to.be.true;
    }
    // some input
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "ABC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = anyToken.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          ParseError.unknown(new SourcePos("foobar", 1, 1)),
          "A",
          new State(
            new Config({ tabWidth: 8 }),
            "BC",
            new SourcePos("foobar", 1, 1),
            "none"
          )
        )
      )).to.be.true;
    }
  });
});

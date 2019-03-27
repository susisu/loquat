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

const { space } = _char;

describe(".space", () => {
  it("should return a parser that parses a space character", () => {
    expect(space).to.be.a.parser;
    // match
    for (const c of " \f\r\v") {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        c + "ABC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = space.run(initState);
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
    // \n
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "\nABC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = space.run(initState);
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
    // \t
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "\tABC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const res = space.run(initState);
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
      const res = space.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
              ErrorMessage.create(ErrorMessageType.EXPECT, "space"),
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
      const res = space.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.EXPECT, "space"),
            ]
          )
        )
      )).to.be.true;
    }
  });
});

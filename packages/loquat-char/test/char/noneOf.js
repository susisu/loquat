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

const { noneOf } = _char;

describe(".noneOf(str)", () => {
  it("should return a parser that parses a character not contained by `str'", () => {
    // not contained
    {
      const initState = new State(
        new Config({ tabWidth: 8, unicode: false }),
        "ABC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = noneOf("XYZ");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          ParseError.unknown(new SourcePos("foobar", 1, 2)),
          "A",
          new State(
            initState.config,
            "BC",
            new SourcePos("foobar", 1, 2),
            "none"
          )
        )
      )).to.be.true;
    }
    // contained
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "ABC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = noneOf("AXYZ");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A"))]
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
      const parser = noneOf("XYZ");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
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
  });

  it("should treat characters in `str' as code points if `unicode' flag of the config is"
    + " `true'", () => {
    // non-unicode mode
    {
      const initState = new State(
        new Config({ tabWidth: 8, unicode: false }),
        "\uD83C\uDF63ABC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = noneOf("\uD83C\uDF63XYZ");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("\uD83C"))]
          )
        )
      )).to.be.true;
    }
    // unicode mode
    {
      const initState = new State(
        new Config({ tabWidth: 8, unicode: true }),
        "\uD83C\uDF63ABC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = noneOf("\uD83C\uDF63XYZ");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("\uD83C\uDF63"))]
          )
        )
      )).to.be.true;
    }
  });
});

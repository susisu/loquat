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

const { string } = _char;

describe(".string(str)", () => {
  it("should return a parser that parses string (character sequence) given by `str'", () => {
    // expect empty
    {
      const initState = new State(
        new Config({ unicode: false }),
        "\uD83C\uDF63X",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = string("");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(
          ParseError.unknown(new SourcePos("foobar", 1, 1)),
          "",
          new State(
            new Config({ unicode: false }),
            "\uD83C\uDF63X",
            new SourcePos("foobar", 1, 1),
            "none"
          )
        )
      )).to.be.true;
    }
    // expect many, correct input
    {
      const initState = new State(
        new Config({ unicode: false }),
        "\uD83C\uDF63X",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = string("\uD83C\uDF63");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          ParseError.unknown(new SourcePos("foobar", 1, 3)),
          "\uD83C\uDF63",
          new State(
            new Config({ unicode: false }),
            "X",
            new SourcePos("foobar", 1, 3),
            "none"
          )
        )
      )).to.be.true;
    }
    // expect many, totally wrong input
    {
      const initState = new State(
        new Config({ unicode: false }),
        "XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = string("\uD83C\uDF63");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "\"X\""),
              ErrorMessage.create(ErrorMessageType.EXPECT, "\"\uD83C\uDF63\""),
            ]
          )
        )
      )).to.be.true;
    }
    // expect many, partially wrong input
    {
      const initState = new State(
        new Config({ unicode: false }),
        "\uD83CXY",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = string("\uD83C\uDF63");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "\"X\""),
              ErrorMessage.create(ErrorMessageType.EXPECT, "\"\uD83C\uDF63\""),
            ]
          )
        )
      )).to.be.true;
    }
    // expect many, no input
    {
      const initState = new State(
        new Config({ unicode: false }),
        "",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = string("\uD83C\uDF63");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.EXPECT, "\"\uD83C\uDF63\""),
            ]
          )
        )
      )).to.be.true;
    }
    // expect many, less input
    {
      const initState = new State(
        new Config({ unicode: false }),
        "\uD83C",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = string("\uD83C\uDF63");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.EXPECT, "\"\uD83C\uDF63\""),
            ]
          )
        )
      )).to.be.true;
    }
  });

  it("should treat characters as code points if unicode flag of the config is `true'", () => {
    // expect empty
    {
      const initState = new State(
        new Config({ unicode: true }),
        "\uD83C\uDF63XY",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = string("");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(
          ParseError.unknown(new SourcePos("foobar", 1, 1)),
          "",
          new State(
            new Config({ unicode: true }),
            "\uD83C\uDF63XY",
            new SourcePos("foobar", 1, 1),
            "none"
          )
        ),
        undefined
      )).to.be.true;
    }
    // expect many, correct input
    {
      const initState = new State(
        new Config({ unicode: true }),
        "\uD83C\uDF63XY",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = string("\uD83C\uDF63X");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          ParseError.unknown(new SourcePos("foobar", 1, 3)),
          "\uD83C\uDF63X",
          new State(
            new Config({ unicode: true }),
            "Y",
            new SourcePos("foobar", 1, 3),
            "none"
          )
        ),
        undefined
      )).to.be.true;
    }
    // expect many, totally wrong input
    {
      const initState = new State(
        new Config({ unicode: true }),
        "XYZ",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = string("\uD83C\uDF63X");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "\"X\""),
              ErrorMessage.create(ErrorMessageType.EXPECT, "\"\uD83C\uDF63X\""),
            ]
          )
        ),
        undefined
      )).to.be.true;
    }
    // expect many, partially wrong input
    {
      const initState = new State(
        new Config({ unicode: true }),
        "\uD83C\uDF63YX",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = string("\uD83C\uDF63X");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "\"Y\""),
              ErrorMessage.create(ErrorMessageType.EXPECT, "\"\uD83C\uDF63X\""),
            ]
          )
        ),
        undefined
      )).to.be.true;
    }
    // expect many, no input
    {
      const initState = new State(
        new Config({ unicode: true }),
        "",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = string("\uD83C\uDF63X");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.EXPECT, "\"\uD83C\uDF63X\""),
            ]
          )
        ),
        undefined
      )).to.be.true;
    }
    // expect many, less input
    {
      const initState = new State(
        new Config({ unicode: true }),
        "\uD83C\uDF63",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = string("\uD83C\uDF63X");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.EXPECT, "\"\uD83C\uDF63X\""),
            ]
          )
        ),
        undefined
      )).to.be.true;
    }
  });
});

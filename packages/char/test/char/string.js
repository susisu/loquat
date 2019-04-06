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
} = $core;

const { string } = $char;

describe("string", () => {
  it("should create a parser that parses the given string", () => {
    // expect empty
    {
      const initState = new State(
        new Config({ unicode: false }),
        "\uD83C\uDF63X",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = string("");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(
        ParseError.unknown(new SourcePos("main", 0, 1, 1)),
        "",
        new State(
          new Config({ unicode: false }),
          "\uD83C\uDF63X",
          new SourcePos("main", 0, 1, 1),
          "none"
        )
      ));
    }
    // expect many, correct input
    {
      const initState = new State(
        new Config({ unicode: false }),
        "\uD83C\uDF63X",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = string("\uD83C\uDF63");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 2, 1, 3)),
        "\uD83C\uDF63",
        new State(
          new Config({ unicode: false }),
          "X",
          new SourcePos("main", 2, 1, 3),
          "none"
        )
      ));
    }
    // expect many, completely wrong input
    {
      const initState = new State(
        new Config({ unicode: false }),
        "XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = string("\uD83C\uDF63");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "\"X\""),
            ErrorMessage.create(ErrorMessageType.EXPECT, "\"\uD83C\uDF63\""),
          ]
        )
      ));
    }
    // expect many, partially wrong input
    {
      const initState = new State(
        new Config({ unicode: false }),
        "\uD83CXY",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = string("\uD83C\uDF63");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "\"X\""),
            ErrorMessage.create(ErrorMessageType.EXPECT, "\"\uD83C\uDF63\""),
          ]
        )
      ));
    }
    // expect many, no input
    {
      const initState = new State(
        new Config({ unicode: false }),
        "",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = string("\uD83C\uDF63");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
            ErrorMessage.create(ErrorMessageType.EXPECT, "\"\uD83C\uDF63\""),
          ]
        )
      ));
    }
    // expect many, short input
    {
      const initState = new State(
        new Config({ unicode: false }),
        "\uD83C",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = string("\uD83C\uDF63");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
            ErrorMessage.create(ErrorMessageType.EXPECT, "\"\uD83C\uDF63\""),
          ]
        )
      ));
    }
  });

  it("should use the unicode flag of the config", () => {
    // expect empty
    {
      const initState = new State(
        new Config({ unicode: true }),
        "\uD83C\uDF63XY",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = string("");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(
        ParseError.unknown(new SourcePos("main", 0, 1, 1)),
        "",
        new State(
          new Config({ unicode: true }),
          "\uD83C\uDF63XY",
          new SourcePos("main", 0, 1, 1),
          "none"
        )
      ));
    }
    // expect many, correct input
    {
      const initState = new State(
        new Config({ unicode: true }),
        "\uD83C\uDF63XY",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = string("\uD83C\uDF63X");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 3, 1, 3)),
        "\uD83C\uDF63X",
        new State(
          new Config({ unicode: true }),
          "Y",
          new SourcePos("main", 3, 1, 3),
          "none"
        )
      ));
    }
    // expect many, completely wrong input
    {
      const initState = new State(
        new Config({ unicode: true }),
        "XYZ",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = string("\uD83C\uDF63X");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "\"X\""),
            ErrorMessage.create(ErrorMessageType.EXPECT, "\"\uD83C\uDF63X\""),
          ]
        )
      ));
    }
    // expect many, partially wrong input
    {
      const initState = new State(
        new Config({ unicode: true }),
        "\uD83C\uDF63YX",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = string("\uD83C\uDF63X");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "\"Y\""),
            ErrorMessage.create(ErrorMessageType.EXPECT, "\"\uD83C\uDF63X\""),
          ]
        )
      ));
    }
    // expect many, no input
    {
      const initState = new State(
        new Config({ unicode: true }),
        "",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = string("\uD83C\uDF63X");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
            ErrorMessage.create(ErrorMessageType.EXPECT, "\"\uD83C\uDF63X\""),
          ]
        )
      ));
    }
    // expect many, short input
    {
      const initState = new State(
        new Config({ unicode: true }),
        "\uD83C\uDF63",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = string("\uD83C\uDF63X");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
            ErrorMessage.create(ErrorMessageType.EXPECT, "\"\uD83C\uDF63X\""),
          ]
        )
      ));
    }
  });
});

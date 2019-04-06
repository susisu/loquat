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
} = $core;

const { noneOf } = $char;

describe("noneOf", () => {
  it("should create a parser that accepts a character not contained in the given string", () => {
    // not contained
    {
      const initState = new State(
        new Config(),
        "ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = noneOf("XYZ");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 1, 1, 2)),
        "A",
        new State(
          initState.config,
          "BC",
          new SourcePos("main", 1, 1, 2),
          "none"
        )
      ));
    }
    // contained
    {
      const initState = new State(
        new Config(),
        "ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = noneOf("ABC");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("A"))]
        )
      ));
    }
    // empty input
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = noneOf("XYZ");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "")]
        )
      ));
    }
  });

  it("should use the unicode flag of the config", () => {
    // unicode = false
    {
      const initState = new State(
        new Config({ unicode: false }),
        "\uD83C\uDF63ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = noneOf("\uD83C\uDF63XYZ");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("\uD83C"))]
        )
      ));
    }
    // unicode = true
    {
      const initState = new State(
        new Config({ unicode: true }),
        "\uD83C\uDF63ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = noneOf("\uD83C\uDF63XYZ");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, show("\uD83C\uDF63"))]
        )
      ));
    }
  });
});

"use strict";

const { expect, assert } = require("chai");

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

const { satisfy } = _char;

describe("satisfy", () => {
  it("should create a parser that accepts a character satisfying the given predicate", () => {
    // test succeeds
    {
      const initState = new State(
        new Config(),
        "ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = satisfy((char, config) => {
        expect(char).to.equal("A");
        expect(config).to.be.an.equalConfigTo(initState.config);
        return true;
      });
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
    // test fails
    {
      const initState = new State(
        new Config(),
        "ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = satisfy((char, config) => {
        expect(char).to.equal("A");
        expect(config).to.be.an.equalConfigTo(initState.config);
        return false;
      });
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
        new Config(),
        "",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = satisfy((char, config) => {
        assert.fail("expect function to not be called");
      });
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
      const parser = satisfy((char, config) => {
        expect(char).to.equal("\uD83C");
        expect(config).to.be.an.equalConfigTo(initState.config);
        return true;
      });
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 1, 1, 2)),
        "\uD83C",
        new State(
          initState.config,
          "\uDF63ABC",
          new SourcePos("main", 1, 1, 2),
          "none"
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
      const parser = satisfy((char, config) => {
        expect(char).to.equal("\uD83C\uDF63");
        expect(config).to.be.an.equalConfigTo(initState.config);
        return true;
      });
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 2, 1, 2)),
        "\uD83C\uDF63",
        new State(
          initState.config,
          "ABC",
          new SourcePos("main", 2, 1, 2),
          "none"
        )
      ));
    }
  });
});

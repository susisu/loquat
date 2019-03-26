"use strict";

const chai = require("chai");
const { expect } = chai;

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

const { tokens } = _prim;

describe("tokens", () => {
  it("should create a parser that parses the given tokens", () => {
    const initConfig = new Config();
    const initPos = new SourcePos("main", 0, 1, 1);
    function generateParser(expectTokens) {
      return tokens(
        expectTokens,
        (x, y) => x === y,
        tokens => tokens.join(""),
        (pos, tokens, config) => {
          expect(pos).to.be.an.equalPositionTo(initPos);
          expect(tokens).to.deep.equal(expectTokens);
          expect(config).to.be.an.equalConfigTo(initConfig);
          return new SourcePos("main", 2, 1, 3);
        }
      );
    }

    // expect empty
    {
      const initState = new State(initConfig, "ABC", initPos, "none");
      const expectTokens = [];
      const parser = generateParser(expectTokens);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.esucc(
          ParseError.unknown(initPos),
          [],
          initState
        ),
        chai.util.eql
      );
    }
    // expect many, correct input
    {
      const initState = new State(initConfig, "ABC", initPos, "none");
      const expectTokens = ["A", "B"];
      const parser = generateParser(expectTokens);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          ParseError.unknown(new SourcePos("main", 2, 1, 3)),
          ["A", "B"],
          new State(
            initState.config,
            "C",
            new SourcePos("main", 2, 1, 3),
            "none"
          )
        ),
        chai.util.eql
      );
    }
    // expect many, completely wrong input
    {
      const initState = new State(initConfig, "CDE", initPos, "none"
      );
      const expectTokens = ["A", "B"];
      const parser = generateParser(expectTokens);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.efail(
          new StrictParseError(
            initPos,
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "C"),
              ErrorMessage.create(ErrorMessageType.EXPECT, "AB"),
            ]
          )
        ),
        chai.util.eql
      );
    }
    // expect many, partially wrong input
    {
      const initState = new State(initConfig, "ACD", initPos, "none");
      const expectTokens = ["A", "B"];
      const parser = generateParser(expectTokens);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.cfail(
          new StrictParseError(
            initPos,
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "C"),
              ErrorMessage.create(ErrorMessageType.EXPECT, "AB"),
            ]
          )
        ),
        chai.util.eql
      );
    }
    // expect many, no input
    {
      const initState = new State(initConfig, "", initPos, "none");
      const expectTokens = ["A", "B"];
      const parser = generateParser(expectTokens);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.efail(
          new StrictParseError(
            initPos,
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.EXPECT, "AB"),
            ]
          )
        ),
        chai.util.eql
      );
    }
    // expect many, short input
    {
      const initState = new State(initConfig, "A", initPos, "none");
      const expectTokens = ["A", "B"];
      const parser = generateParser(expectTokens);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.cfail(
          new StrictParseError(
            initPos,
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, ""),
              ErrorMessage.create(ErrorMessageType.EXPECT, "AB"),
            ]
          )
        ),
        chai.util.eql
      );
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
      const expectTokens = ["\uD83C\uDF63", "A"];
      const parser = tokens(
        expectTokens,
        (x, y) => x === y,
        tokens => tokens.join(""),
        (pos, tokens, config) => {
          expect(pos).to.be.an.equalPositionTo(initState.pos);
          expect(tokens).to.deep.equal(expectTokens);
          expect(config).to.be.an.equalConfigTo(initState.config);
          return new SourcePos("main", 2, 1, 3);
        }
      );
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.efail(
          new StrictParseError(
            new SourcePos("main", 0, 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "\uD83C"),
              ErrorMessage.create(ErrorMessageType.EXPECT, "\uD83C\uDF63A"),
            ]
          )
        ),
        chai.util.eql
      );
    }
    // unicode = true
    {
      const initState = new State(
        new Config({ unicode: true }),
        "\uD83C\uDF63ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const expectTokens = ["\uD83C\uDF63", "A"];
      const parser = tokens(
        expectTokens,
        (x, y) => x === y,
        tokens => tokens.join(""),
        (pos, tokens, config) => {
          expect(pos).to.be.an.equalPositionTo(initState.pos);
          expect(tokens).to.deep.equal(expectTokens);
          expect(config).to.be.an.equalConfigTo(initState.config);
          return new SourcePos("main", 2, 1, 3);
        }
      );
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(
          ParseError.unknown(new SourcePos("main", 2, 1, 3)),
          ["\uD83C\uDF63", "A"],
          new State(
            initState.config,
            "BC",
            new SourcePos("main", 2, 1, 3),
            "none"
          )
        ),
        chai.util.eql
      );
    }
  });
});

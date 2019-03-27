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

const { satisfy } = _char;

describe(".satisfy(test)", () => {
  it("should return a parser that parses a character satisfying `test'", () => {
    // test succeeds
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "ABC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = satisfy(
        (char, config) => {
          expect(char).to.equal("A");
          expect(Config.equal(config, new Config({ tabWidth: 8 }))).to.be.true;
          return true;
        }
      );
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
    // test fails
    {
      const initState = new State(
        new Config({ tabWidth: 8 }),
        "ABC",
        new SourcePos("foobar", 1, 1),
        "none"
      );
      const parser = satisfy(
        (x, config) => {
          expect(x).to.equal("A");
          expect(Config.equal(config, new Config({ tabWidth: 8 }))).to.be.true;
          return false;
        }
      );
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
      const parser = satisfy(() => { throw new Error("unexpected call"); });
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
});

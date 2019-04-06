"use strict";

const { expect, assert } = require("chai");

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

const { token } = $prim;

describe("token", () => {
  it("should create a parser that parses a single token", () => {
    // calcValue succeeds, long input
    {
      const initState = new State(
        new Config(),
        "ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = token(
        (x, config) => {
          expect(x).to.equal("A");
          expect(config).to.be.an.equalConfigTo(initState.config);
          return { empty: false, value: "foo" };
        },
        _ => assert.fail("expect function to not be called"),
        (x, config) => {
          expect(x).to.equal("B");
          expect(config).to.be.an.equalConfigTo(initState.config);
          return new SourcePos("main", 1, 1, 2);
        }
      );
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 1, 1, 2)),
        "foo",
        new State(
          initState.config,
          "BC",
          new SourcePos("main", 1, 1, 2),
          "none"
        )
      ));
    }
    // calcValue succeeds, exact input
    {
      const initState = new State(
        new Config(),
        "A",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = token(
        (x, config) => {
          expect(x).to.equal("A");
          expect(config).to.be.an.equalConfigTo(initState.config);
          return { empty: false, value: "foo" };
        },
        _ => assert.fail("expect function to not be called"),
        (x, config) => {
          expect(x).to.equal("A");
          expect(config).to.be.an.equalConfigTo(initState.config);
          return new SourcePos("main", 1, 1, 2);
        }
      );
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 1, 1, 2)),
        "foo",
        new State(
          initState.config,
          "",
          new SourcePos("main", 1, 1, 2),
          "none"
        )
      ));
    }
    // calcValue fails
    {
      const initState = new State(
        new Config(),
        "ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = token(
        (x, config) => {
          expect(x).to.equal("A");
          expect(config).to.be.an.equalConfigTo(initState.config);
          return { empty: true };
        },
        x => {
          expect(x).to.equal("A");
          return "foo";
        },
        (x, config) => {
          expect(config).to.be.an.equalConfigTo(initState.config);
        }
      );
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo")]
        )
      ));
    }
    // empty input
    {
      const initState = new State(
        new Config({ unicode: false }),
        "",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = token(
        (_, _config) => assert.fail("expect function to not be called"),
        _ => assert.fail("expect function to not be called"),
        (_, _config) => assert.fail("expect function to not be called")
      );
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
        "\uD83C\uDF63\uD83C\uDF64ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = token(
        (x, config) => {
          expect(x).to.equal("\uD83C");
          expect(config).to.be.an.equalConfigTo(initState.config);
          return { empty: false, value: "foo" };
        },
        _ => assert.fail("expect function to not be called"),
        (x, config) => {
          expect(x).to.equal("\uDF63");
          expect(config).to.be.an.equalConfigTo(initState.config);
          return new SourcePos("main", 1, 1, 2);
        }
      );
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 1, 1, 2)),
        "foo",
        new State(
          initState.config,
          "\uDF63\uD83C\uDF64ABC",
          new SourcePos("main", 1, 1, 2),
          "none"
        )
      ));
    }
    // unicode = true
    {
      const initState = new State(
        new Config({ unicode: true }),
        "\uD83C\uDF63\uD83C\uDF64ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = token(
        (x, config) => {
          expect(x).to.equal("\uD83C\uDF63");
          expect(config).to.be.an.equalConfigTo(initState.config);
          return { empty: false, value: "foo" };
        },
        _ => assert.fail("expect function to not be called"),
        (x, config) => {
          expect(x).to.equal("\uD83C\uDF64");
          expect(config).to.be.an.equalConfigTo(initState.config);
          return new SourcePos("main", 2, 1, 2);
        }
      );
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 2, 1, 2)),
        "foo",
        new State(
          initState.config,
          "\uD83C\uDF64ABC",
          new SourcePos("main", 2, 1, 2),
          "none"
        )
      ));
    }
  });
});

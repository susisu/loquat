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
} = _core;

const { tokenPrim } = _prim;

describe("tokenPrim", () => {
  it("should create a parser that parses a single token", () => {
    // calcValue succeeds
    {
      const initState = new State(
        new Config(),
        "ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = tokenPrim(
        (x, config) => {
          expect(x).to.equal("A");
          expect(config).to.be.an.equalConfigTo(initState.config);
          return { empty: false, value: "foo" };
        },
        x => {
          assert.fail("expect function to not be called");
        },
        (pos, x, xs, config) => {
          expect(pos).to.be.an.equalPositionTo(initState.pos);
          expect(x).to.equal("A");
          expect(xs).to.equal("BC");
          expect(config).to.be.an.equalConfigTo(initState.config);
          return new SourcePos("main", 1, 1, 2);
        },
        (userState, pos, x, xs, config) => {
          expect(userState).to.equal("none");
          expect(pos).to.be.an.equalPositionTo(initState.pos);
          expect(x).to.equal("A");
          expect(xs).to.equal("BC");
          expect(config).to.be.an.equalConfigTo(initState.config);
          return "some";
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
          "some"
        )
      )
      );
    }
    // calcValue succeeds, use the default value for calcNextUserState
    {
      const initState = new State(
        new Config(),
        "ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = tokenPrim(
        (x, config) => {
          expect(x).to.equal("A");
          expect(config).to.be.an.equalConfigTo(initState.config);
          return { empty: false, value: "nyancat" };
        },
        x => {
          assert.fail("expect function to not be called");
        },
        (pos, x, xs, config) => {
          expect(pos).to.be.an.equalPositionTo(initState.pos);
          expect(x).to.equal("A");
          expect(xs).to.equal("BC");
          expect(config).to.be.an.equalConfigTo(initState.config);
          return new SourcePos("main", 1, 1, 2);
        }
      );
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 1, 1, 2)),
        "nyancat",
        new State(
          initState.config,
          "BC",
          new SourcePos("main", 1, 1, 2),
          "none"
        )
      )
      );
    }
    // calcValue fails
    {
      const initState = new State(
        new Config(),
        "ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = tokenPrim(
        (x, config) => {
          expect(x).to.equal("A");
          expect(config).to.be.an.equalConfigTo(initState.config);
          return { empty: true };
        },
        x => {
          expect(x).to.equal("A");
          return "foo";
        },
        (pos, x, xs, config) => {
          assert.fail("expect function to not be called");
        },
        (userState, pos, x, xs, config) => {
          assert.fail("expect function to not be called");
        }
      );
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo")]
        )
      )
      );
    }
    // empty input
    {
      const initState = new State(
        new Config(),
        "",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = tokenPrim(
        (x, config) => {
          assert.fail("expect function to not be called");
        },
        x => {
          assert.fail("expect function to not be called");
        },
        (pos, x, xs, config) => {
          assert.fail("expect function to not be called");
        },
        (userState, pos, x, xs, config) => {
          assert.fail("expect function to not be called");
        }
      );
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "")]
        )
      )
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
      const parser = tokenPrim(
        (x, config) => {
          expect(x).to.equal("\uD83C");
          expect(config).to.be.an.equalConfigTo(initState.config);
          return { empty: false, value: "foo" };
        },
        x => {
          assert.fail("expect function to not be called");
        },
        (pos, x, xs, config) => {
          expect(pos).to.be.an.equalPositionTo(initState.pos);
          expect(x).to.equal("\uD83C");
          expect(xs).to.equal("\uDF63ABC");
          expect(config).to.be.an.equalConfigTo(initState.config);
          return new SourcePos("main", 1, 1, 2);
        },
        (userState, pos, x, xs, config) => {
          expect(userState).to.equal("none");
          expect(pos).to.be.an.equalPositionTo(initState.pos);
          expect(x).to.equal("\uD83C");
          expect(xs).to.equal("\uDF63ABC");
          expect(config).to.be.an.equalConfigTo(initState.config);
          return "some";
        }
      );
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 1, 1, 2)),
        "foo",
        new State(
          initState.config,
          "\uDF63ABC",
          new SourcePos("main", 1, 1, 2),
          "some"
        )
      )
      );
    }
    // unicode mode
    {
      const initState = new State(
        new Config({ unicode: true }),
        "\uD83C\uDF63ABC",
        new SourcePos("main", 0, 1, 1),
        "none"
      );
      const parser = tokenPrim(
        (x, config) => {
          expect(x).to.equal("\uD83C\uDF63");
          expect(config).to.be.an.equalConfigTo(initState.config);
          return { empty: false, value: "foo" };
        },
        x => {
          assert.fail("expect function to not be called");
        },
        (pos, x, xs, config) => {
          expect(pos).to.be.an.equalPositionTo(initState.pos);
          expect(x).to.equal("\uD83C\uDF63");
          expect(xs).to.equal("ABC");
          expect(config).to.be.an.equalConfigTo(initState.config);
          return new SourcePos("main", 2, 1, 2);
        },
        (userState, pos, x, xs, config) => {
          expect(userState).to.equal("none");
          expect(pos).to.be.an.equalPositionTo(initState.pos);
          expect(x).to.equal("\uD83C\uDF63");
          expect(xs).to.equal("ABC");
          expect(config).to.be.an.equalConfigTo(initState.config);
          return "some";
        }
      );
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.unknown(new SourcePos("main", 2, 1, 2)),
        "foo",
        new State(
          initState.config,
          "ABC",
          new SourcePos("main", 2, 1, 2),
          "some"
        )
      )
      );
    }
  });
});

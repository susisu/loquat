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
  StrictParser,
} = _core;

const { unless } = _monad;

describe(".unless(cond, parser)", () => {
  it("should return a parser that runs `parser' only when `cond' is `false'", () => {
    const initState = new State(
      new Config({ tabWidth: 8 }),
      "input",
      new SourcePos("foobar", 1, 1),
      "none"
    );
    // false, csucc
    {
      const finalState = new State(
        new Config({ tabWidth: 8 }),
        "rest",
        new SourcePos("foobar", 1, 2),
        "some"
      );
      const err = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(err, "nyancat", finalState);
      });

      const condParser = unless(false, parser);
      expect(condParser).to.be.a.parser;
      const res = condParser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(err, "nyancat", finalState)
      )).to.be.true;
    }
    // false, cfail
    {
      const err = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.cfail(err);
      });

      const condParser = unless(false, parser);
      expect(condParser).to.be.a.parser;
      const res = condParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(err)
      )).to.be.true;
    }
    // false, esucc
    {
      const finalState = new State(
        new Config({ tabWidth: 8 }),
        "rest",
        new SourcePos("foobar", 1, 1),
        "some"
      );
      const err = new StrictParseError(
        new SourcePos("foobar", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(err, "nyancat", finalState);
      });

      const condParser = unless(false, parser);
      expect(condParser).to.be.a.parser;
      const res = condParser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(err, "nyancat", finalState)
      )).to.be.true;
    }
    // false, efail
    {
      const err = new StrictParseError(
        new SourcePos("foobar", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.efail(err);
      });

      const condParser = unless(false, parser);
      expect(condParser).to.be.a.parser;
      const res = condParser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(err)
      )).to.be.true;
    }
    // true
    {
      const parser = new StrictParser(() => { throw new Error("unexpected call"); });

      const condParser = unless(true, parser);
      expect(condParser).to.be.a.parser;
      const res = condParser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(ParseError.unknown(initState.pos), undefined, initState)
      )).to.be.true;
    }
  });
});

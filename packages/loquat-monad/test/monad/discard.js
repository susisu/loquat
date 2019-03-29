"use strict";

const { expect } = require("chai");

const {
  SourcePos,
  ErrorMessageType,
  ErrorMessage,
  StrictParseError,
  Config,
  State,
  Result,
  StrictParser,
} = _core;

const { discard } = _monad;

describe(".discard(parser)", () => {
  it("should return a parser that runs `parser' and discards the resultant value", () => {
    const initState = new State(
      new Config({ tabWidth: 8 }),
      "input",
      new SourcePos("foobar", 1, 1),
      "none"
    );
    // csucc
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
      const voidParser = discard(parser);
      expect(voidParser).to.be.a.parser;
      const res = voidParser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(err, undefined, finalState)
      )).to.be.true;
    }
    // cfail
    {
      const err = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.cfail(err);
      });
      const voidParser = discard(parser);
      expect(voidParser).to.be.a.parser;
      const res = voidParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(err)
      )).to.be.true;
    }
    // esucc
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
      const voidParser = discard(parser);
      expect(voidParser).to.be.a.parser;
      const res = voidParser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(err, undefined, finalState)
      )).to.be.true;
    }
    // efail
    {
      const err = new StrictParseError(
        new SourcePos("foobar", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.efail(err);
      });
      const voidParser = discard(parser);
      expect(voidParser).to.be.a.parser;
      const res = voidParser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(err)
      )).to.be.true;
    }
  });
});

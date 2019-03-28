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

const { option } = _combinators;

describe(".option(val, parser)", () => {
  it("should return a parser that attempts to parse by `parser',"
        + " and returns its result unless it empty fails, or returns `val'", () => {
    const initState = new State(
      new Config({ tabWidth: 8 }),
      "input",
      new SourcePos("foobar", 1, 1),
      "none"
    );
    const finalState = new State(
      new Config({ tabWidth: 4 }),
      "rest",
      new SourcePos("foobar", 496, 28),
      "some"
    );
    const err = new StrictParseError(
      new SourcePos("foobar", 496, 28),
      [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
    );
    // csucc
    {
      const parser = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(err, "nyan", finalState);
      });
      const optParser = option("cat", parser);
      expect(optParser).to.be.a.parser;
      const res = optParser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(err, "nyan", finalState)
      )).to.be.true;
    }
    // cfail
    {
      const parser = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.cfail(err);
      });
      const optParser = option("cat", parser);
      expect(optParser).to.be.a.parser;
      const res = optParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(err)
      )).to.be.true;
    }
    // esucc
    {
      const parser = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(err, "nyan", finalState);
      });
      const optParser = option("cat", parser);
      expect(optParser).to.be.a.parser;
      const res = optParser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(err, "nyan", finalState)
      )).to.be.true;
    }
    // efail
    {
      const parser = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.efail(err);
      });
      const optParser = option("cat", parser);
      expect(optParser).to.be.a.parser;
      const res = optParser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(err, "cat", initState)
      )).to.be.true;
    }
  });
});

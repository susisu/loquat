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

const { msum } = _monad;

describe(".msum(parsers)", () => {
  it("should return a parser that empty-fails with unknown error if `parsers' is empty", () => {
    const initState = new State(
      new Config({ tabWidth: 8 }),
      "ABC",
      new SourcePos("foobar", 1, 1),
      "none"
    );
    const parser = msum([]);
    expect(parser).to.be.a.parser;
    const res = parser.run(initState);
    expect(Result.equal(
      res,
      Result.efail(ParseError.unknown(new SourcePos("foobar", 1, 1)))
    )).to.be.true;
  });

  it("should return a parser that attempts to parse by each parser in `parsers',"
        + " and return the result of the first one that succeeds", () => {
    const initState = new State(
      new Config({ tabWidth: 8 }),
      "input",
      new SourcePos("foobar", 1, 1),
      "none"
    );
    // csucc, *
    {
      const stateA = new State(
        new Config({ tabWidth: 8 }),
        "restA",
        new SourcePos("foobar", 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "nyancat", stateA);
      });
      const parserB = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = msum([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errA, "nyancat", stateA)
      )).to.be.true;
    }
    // cfail, *
    {
      const errA = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.cfail(errA);
      });
      const parserB = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = msum([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errA)
      )).to.be.true;
    }
    // esucc, *
    {
      const stateA = new State(
        new Config({ tabWidth: 8 }),
        "restA",
        new SourcePos("foobar", 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "nyancat", stateA);
      });
      const parserB = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = msum([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(errA, "nyancat", stateA)
      )).to.be.true;
    }
    // efail, csucc
    {
      const errA = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.efail(errA);
      });
      const stateB = new State(
        new Config({ tabWidth: 8 }),
        "restB",
        new SourcePos("foobar", 1, 2),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errB, "nyancat", stateB);
      });
      const parser = msum([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errB, "nyancat", stateB)
      )).to.be.true;
    }
    // efail, cfail
    {
      const errA = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.efail(errA);
      });
      const errB = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.cfail(errB);
      });
      const parser = msum([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errB)
      )).to.be.true;
    }
    // efail, esucc
    {
      const errA = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.efail(errA);
      });
      const stateB = new State(
        new Config({ tabWidth: 8 }),
        "restB",
        new SourcePos("foobar", 1, 2),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errB, "nyancat", stateB);
      });
      const parser = msum([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(ParseError.merge(errA, errB), "nyancat", stateB)
      )).to.be.true;
    }
    // efail, efail
    {
      const errA = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.efail(errA);
      });
      const errB = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.efail(errB);
      });
      const parser = msum([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(ParseError.merge(errA, errB))
      )).to.be.true;
    }
  });
});

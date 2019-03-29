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

const { liftM2 } = _monad;

describe(".liftM2(func)", () => {
  it("should lift a function `func' to a function from two parsers to a parser", () => {
    const func = (x, y) => x.toUpperCase() + y.toLowerCase();
    const liftedFunc = liftM2(func);
    expect(liftedFunc).is.a("function");

    const initState = new State(
      new Config({ tabWidth: 8 }),
      "input",
      new SourcePos("foobar", 1, 1),
      "none"
    );
    const stateA = new State(
      new Config({ tabWidth: 4 }),
      "restA",
      new SourcePos("foobar", 1, 1),
      "someA"
    );
    const errA = new StrictParseError(
      new SourcePos("foobar", 1, 1),
      [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
    );
    const stateB = new State(
      new Config({ tabWidth: 4 }),
      "restB",
      new SourcePos("foobar", 1, 1),
      "someB"
    );
    const errB = new StrictParseError(
      new SourcePos("foobar", 1, 1),
      [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
    );
    // csucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "nyan", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "CAT", stateB);
      });
      const parser = liftedFunc(parserA, parserB);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errB, "NYANcat", stateB)
      )).to.be.true;
    }
    // csucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "nyan", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.cfail(errB);
      });
      const parser = liftedFunc(parserA, parserB);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errB)
      )).to.be.true;
    }
    // csucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "nyan", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "CAT", stateB);
      });
      const parser = liftedFunc(parserA, parserB);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(ParseError.merge(errA, errB), "NYANcat", stateB)
      )).to.be.true;
    }
    // csucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "nyan", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.efail(errB);
      });
      const parser = liftedFunc(parserA, parserB);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(errA, errB))
      )).to.be.true;
    }
    // cfail, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.cfail(errA);
      });
      const parserB = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errA)
      )).to.be.true;
    }
    // esucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "nyan", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "CAT", stateB);
      });
      const parser = liftedFunc(parserA, parserB);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errB, "NYANcat", stateB)
      )).to.be.true;
    }
    // esucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "nyan", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.cfail(errB);
      });
      const parser = liftedFunc(parserA, parserB);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errB)
      )).to.be.true;
    }
    // esucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "nyan", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "CAT", stateB);
      });
      const parser = liftedFunc(parserA, parserB);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(ParseError.merge(errA, errB), "NYANcat", stateB)
      )).to.be.true;
    }
    // esucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "nyan", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.efail(errB);
      });
      const parser = liftedFunc(parserA, parserB);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(ParseError.merge(errA, errB))
      )).to.be.true;
    }
    // efail, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.efail(errA);
      });
      const parserB = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(errA)
      )).to.be.true;
    }
  });
});

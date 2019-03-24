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
  StrictParser,
} = _core;

const { left } = _prim;

describe("left", () => {
  it("should create a parser that runs two parsers sequentially and returns the result of the"
    + " former one", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    const stateA = new State(
      new Config(),
      "restA",
      new SourcePos("main", 1, 1, 2),
      "someA"
    );
    const errA = new StrictParseError(
      new SourcePos("main", 1, 1, 2),
      [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
    );
    const stateB = new State(
      new Config(),
      "restB",
      new SourcePos("main", 1, 1, 2),
      "someB"
    );
    const errB = new StrictParseError(
      new SourcePos("main", 1, 1, 2),
      [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
    );
    // csucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "foo", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.csucc(errB, "bar", stateB);
      });
      const composed = left(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errB, "foo", stateB));
    }
    // csucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "foo", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.cfail(errB);
      });
      const composed = left(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errB));
    }
    // csucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "foo", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.esucc(errB, "bar", stateB);
      });
      const composed = left(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(ParseError.merge(errA, errB), "foo", stateB));
    }
    // csucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "foo", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.efail(errB);
      });
      const composed = left(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errA, errB)));
    }
    // cfail
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(errA);
      });
      const parserB = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const composed = left(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errA));
    }
    // esucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "foo", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.csucc(errB, "bar", stateB);
      });
      const composed = left(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errB, "foo", stateB));
    }
    // esucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "foo", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.cfail(errB);
      });
      const composed = left(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errB));
    }
    // esucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "foo", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.esucc(errB, "bar", stateB);
      });
      const composed = left(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(ParseError.merge(errA, errB), "foo", stateB));
    }
    // esucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "foo", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.efail(errB);
      });
      const composed = left(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(ParseError.merge(errA, errB)));
    }
    // efail
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(errA);
      });
      const parserB = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const composed = left(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(errA));
    }
  });
});

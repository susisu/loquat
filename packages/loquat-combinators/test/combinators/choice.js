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

const { choice } = _combinators;

describe("choice", () => {
  it("should create a parser that fails without consumption, with an unknown error, if the argument"
    + " is an empty array", () => {
    const initState = new State(
      new Config(),
      "ABC",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    const parser = choice([]);
    expect(parser).to.be.a.parser;
    const res = parser.run(initState);
    expect(res).to.be.an.equalResultTo(Result.efail(
      ParseError.unknown(new SourcePos("main", 0, 1, 1)))
    );
  });

  it("should create a parser that tries each given parser sequentially, and returns the result"
    + " of the first successful one", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    // csucc, *
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 0, 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 0, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "foo", stateA);
      });
      const parserB = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const parser = choice([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errA, "foo", stateA));
    }
    // cfail, *
    {
      const errA = new StrictParseError(
        new SourcePos("main", 0, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(errA);
      });
      const parserB = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const parser = choice([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errA));
    }
    // esucc, *
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 0, 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 0, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "foo", stateA);
      });
      const parserB = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = choice([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(errA, "foo", stateA));
    }
    // efail, csucc
    {
      const errA = new StrictParseError(
        new SourcePos("main", 0, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(errA);
      });
      const stateB = new State(
        new Config(),
        "restB",
        new SourcePos("main", 0, 1, 2),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("main", 0, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errB, "foo", stateB);
      });
      const parser = choice([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errB, "foo", stateB));
    }
    // efail, cfail
    {
      const errA = new StrictParseError(
        new SourcePos("main", 0, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(errA);
      });
      const errB = new StrictParseError(
        new SourcePos("main", 0, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(errB);
      });
      const parser = choice([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errB));
    }
    // efail, esucc
    {
      const errA = new StrictParseError(
        new SourcePos("main", 0, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(errA);
      });
      const stateB = new State(
        new Config(),
        "restB",
        new SourcePos("main", 0, 1, 2),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("main", 0, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errB, "foo", stateB);
      });
      const parser = choice([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(ParseError.merge(errA, errB), "foo", stateB));
    }
    // efail, efail
    {
      const errA = new StrictParseError(
        new SourcePos("main", 0, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(errA);
      });
      const errB = new StrictParseError(
        new SourcePos("main", 0, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(errB);
      });
      const parser = choice([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(ParseError.merge(errA, errB)));
    }
  });
});

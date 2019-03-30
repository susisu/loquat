"use strict";

const chai = require("chai");
const { expect, assert } = chai;

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

const { sequence } = _monad;

describe("sequence", () => {
  it("should create a parser that runs the given parsers sequentially", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    // empty
    {
      const parser = sequence([]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.esucc(ParseError.unknown(initState.pos), [], initState),
        chai.util.eql
      );
    }
    // csucc, csucc
    {
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
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "foo", stateA);
      });

      const stateB = new State(
        new Config(),
        "restB",
        new SourcePos("main", 2, 1, 3),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("main", 2, 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.csucc(errB, "bar", stateB);
      });

      const parser = sequence([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(errB, ["foo", "bar"], stateB),
        chai.util.eql
      );
    }
    // csucc, cfail
    {
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
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "foo", stateA);
      });

      const errB = new StrictParseError(
        new SourcePos("main", 2, 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.cfail(errB);
      });

      const parser = sequence([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errB));
    }
    // csucc, esucc
    {
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
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "foo", stateA);
      });

      const stateB = new State(
        new Config(),
        "restB",
        new SourcePos("main", 2, 1, 3),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("main", 2, 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.esucc(errB, "bar", stateB);
      });

      const parser = sequence([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(ParseError.merge(errA, errB), ["foo", "bar"], stateB),
        chai.util.eql
      );
    }
    // csucc, efail
    {
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
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "foo", stateA);
      });

      const errB = new StrictParseError(
        new SourcePos("main", 2, 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.efail(errB);
      });

      const parser = sequence([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errA, errB)));
    }
    // cfail, *
    {
      const errA = new StrictParseError(
        new SourcePos("main", 1, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(errA);
      });

      const parserB = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });

      const parser = sequence([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errA));
    }
    // esucc, csucc
    {
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
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "foo", stateA);
      });

      const stateB = new State(
        new Config(),
        "restB",
        new SourcePos("main", 2, 1, 3),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("main", 2, 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.csucc(errB, "bar", stateB);
      });

      const parser = sequence([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(errB, ["foo", "bar"], stateB),
        chai.util.eql
      );
    }
    // esucc, cfail
    {
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
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "foo", stateA);
      });

      const errB = new StrictParseError(
        new SourcePos("main", 2, 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.cfail(errB);
      });

      const parser = sequence([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errB));
    }
    // esucc, esucc
    {
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
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "foo", stateA);
      });

      const stateB = new State(
        new Config(),
        "restB",
        new SourcePos("main", 2, 1, 3),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("main", 2, 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.esucc(errB, "bar", stateB);
      });

      const parser = sequence([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.esucc(ParseError.merge(errA, errB), ["foo", "bar"], stateB),
        chai.util.eql
      );
    }
    // esucc, efail
    {
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
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "foo", stateA);
      });

      const errB = new StrictParseError(
        new SourcePos("main", 2, 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.efail(errB);
      });

      const parser = sequence([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(ParseError.merge(errA, errB)));
    }
    // efail, *
    {
      const errA = new StrictParseError(
        new SourcePos("main", 1, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(errA);
      });

      const parserB = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });

      const parser = sequence([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(errA));
    }
  });
});

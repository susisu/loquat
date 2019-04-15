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
} = $core;

const { sequence_ } = $monad;

describe("sequence_", () => {
  it("should create a parser that runs the given parsers sequentially and discards all the"
    + " results", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 1, 1),
      "none"
    );
    // empty
    {
      const parser = sequence_([]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(
        ParseError.unknown(initState.pos),
        undefined,
        initState
      ));
    }
    // csucc, csucc
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "foo", stateA);
      });

      const stateB = new State(
        new Config(),
        "restB",
        new SourcePos("main", 1, 3),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("main", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.csucc(errB, "bar", stateB);
      });

      const parser = sequence_([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errB, undefined, stateB));
    }
    // csucc, cfail
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "foo", stateA);
      });

      const errB = new StrictParseError(
        new SourcePos("main", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.cfail(errB);
      });

      const parser = sequence_([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errB));
    }
    // csucc, esucc
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "foo", stateA);
      });

      const stateB = new State(
        new Config(),
        "restB",
        new SourcePos("main", 1, 3),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("main", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.esucc(errB, "bar", stateB);
      });

      const parser = sequence_([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(errA, errB),
        undefined,
        stateB
      ));
    }
    // csucc, efail
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "foo", stateA);
      });

      const errB = new StrictParseError(
        new SourcePos("main", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.efail(errB);
      });

      const parser = sequence_([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errA, errB)));
    }
    // cfail, *
    {
      const errA = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(errA);
      });

      const parserB = new StrictParser(_ => assert.fail("expect function to not be called"));

      const parser = sequence_([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errA));
    }
    // esucc, csucc
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "foo", stateA);
      });

      const stateB = new State(
        new Config(),
        "restB",
        new SourcePos("main", 1, 3),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("main", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.csucc(errB, "bar", stateB);
      });

      const parser = sequence_([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errB, undefined, stateB));
    }
    // esucc, cfail
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "foo", stateA);
      });

      const errB = new StrictParseError(
        new SourcePos("main", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.cfail(errB);
      });

      const parser = sequence_([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errB));
    }
    // esucc, esucc
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "foo", stateA);
      });

      const stateB = new State(
        new Config(),
        "restB",
        new SourcePos("main", 1, 3),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("main", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.esucc(errB, "bar", stateB);
      });

      const parser = sequence_([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(
        ParseError.merge(errA, errB),
        undefined,
        stateB
      ));
    }
    // esucc, efail
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 1, 2),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "foo", stateA);
      });

      const errB = new StrictParseError(
        new SourcePos("main", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.efail(errB);
      });

      const parser = sequence_([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(ParseError.merge(errA, errB)));
    }
    // efail, *
    {
      const errA = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(errA);
      });

      const parserB = new StrictParser(_ => assert.fail("expect function to not be called"));

      const parser = sequence_([parserA, parserB]);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(errA));
    }
  });
});

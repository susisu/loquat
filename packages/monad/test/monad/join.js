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
} = $core;

const { join } = $monad;

describe("join", () => {
  it("should create a parser that runs the given parser and successively runs the result value as a"
    + " parser", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 1, 1),
      "none"
    );
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
        return Result.csucc(errB, "foo", stateB);
      });
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, parserB, stateA);
      });

      const parser = join(parserA);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errB, "foo", stateB));
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
      const errB = new StrictParseError(
        new SourcePos("main", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.cfail(errB);
      });
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, parserB, stateA);
      });

      const parser = join(parserA);
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
      const stateB = new State(
        new Config(),
        "restB",
        new SourcePos("main", 1, 2),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.esucc(errB, "foo", stateB);
      });
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, parserB, stateA);
      });

      const parser = join(parserA);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(ParseError.merge(errA, errB), "foo", stateB));
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
      const errB = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.efail(errB);
      });
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, parserB, stateA);
      });

      const parser = join(parserA);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errA, errB)));
    }
    // cfail
    {
      const errA = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(errA);
      });

      const parser = join(parserA);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errA));
    }
    // esucc, csucc
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 1, 1),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const stateB = new State(
        new Config(),
        "restB",
        new SourcePos("main", 1, 2),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.csucc(errB, "foo", stateB);
      });
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, parserB, stateA);
      });

      const parser = join(parserA);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errB, "foo", stateB));
    }
    // esucc, cfail
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 1, 1),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const errB = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.cfail(errB);
      });
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, parserB, stateA);
      });

      const parser = join(parserA);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errB));
    }
    // esucc, esucc
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 1, 1),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const stateB = new State(
        new Config(),
        "restB",
        new SourcePos("main", 1, 1),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.esucc(errB, "foo", stateB);
      });
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, parserB, stateA);
      });

      const parser = join(parserA);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(ParseError.merge(errA, errB), "foo", stateB));
    }
    // esucc, efail
    {
      const stateA = new State(
        new Config(),
        "restA",
        new SourcePos("main", 1, 1),
        "someA"
      );
      const errA = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const errB = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.efail(errB);
      });
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, parserB, stateA);
      });

      const parser = join(parserA);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(ParseError.merge(errA, errB)));
    }
    // efail
    {
      const errA = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(errA);
      });

      const parser = join(parserA);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(errA));
    }
  });
});

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

const { rtol } = $monad;

describe("rtol", () => {
  it("should compose functions from values to parsers, from right to left", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    // csucc, csucc
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
      const funcA = val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.csucc(errA, "bar", stateA);
        });
      };

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
      const funcB = val => {
        expect(val).to.equal("bar");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(stateA);
          return Result.csucc(errB, "baz", stateB);
        });
      };

      const func = rtol(funcB, funcA);
      expect(func).to.be.a("function");
      const parser = func("foo");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errB, "baz", stateB));
    }
    // csucc, cfail
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
      const funcA = val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.csucc(errA, "bar", stateA);
        });
      };

      const errB = new StrictParseError(
        new SourcePos("main", 2, 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const funcB = val => {
        expect(val).to.equal("bar");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(stateA);
          return Result.cfail(errB);
        });
      };

      const func = rtol(funcB, funcA);
      expect(func).to.be.a("function");
      const parser = func("foo");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errB));
    }
    // csucc, esucc
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
      const funcA = val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.csucc(errA, "bar", stateA);
        });
      };

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
      const funcB = val => {
        expect(val).to.equal("bar");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(stateA);
          return Result.esucc(errB, "baz", stateB);
        });
      };

      const func = rtol(funcB, funcA);
      expect(func).to.be.a("function");
      const parser = func("foo");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(ParseError.merge(errA, errB), "baz", stateB));
    }
    // csucc, efail
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
      const funcA = val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.csucc(errA, "bar", stateA);
        });
      };

      const errB = new StrictParseError(
        new SourcePos("main", 0, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const funcB = val => {
        expect(val).to.equal("bar");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(stateA);
          return Result.efail(errB);
        });
      };

      const func = rtol(funcB, funcA);
      expect(func).to.be.a("function");
      const parser = func("foo");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errA, errB)));
    }
    // cfail, *
    {
      const errA = new StrictParseError(
        new SourcePos("main", 0, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const funcA = val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.cfail(errA);
        });
      };

      const funcB = _ => assert.fail("expect function to not be called");

      const func = rtol(funcB, funcA);
      expect(func).to.be.a("function");
      const parser = func("foo");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errA));
    }
    // esucc, csucc
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
      const funcA = val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.esucc(errA, "bar", stateA);
        });
      };

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
      const funcB = val => {
        expect(val).to.equal("bar");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(stateA);
          return Result.csucc(errB, "baz", stateB);
        });
      };

      const func = rtol(funcB, funcA);
      expect(func).to.be.a("function");
      const parser = func("foo");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errB, "baz", stateB));
    }
    // esucc, cfail
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
      const funcA = val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.esucc(errA, "bar", stateA);
        });
      };

      const errB = new StrictParseError(
        new SourcePos("main", 2, 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const funcB = val => {
        expect(val).to.equal("bar");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(stateA);
          return Result.cfail(errB);
        });
      };

      const func = rtol(funcB, funcA);
      expect(func).to.be.a("function");
      const parser = func("foo");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errB));
    }
    // esucc, esucc
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
      const funcA = val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.esucc(errA, "bar", stateA);
        });
      };

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
      const funcB = val => {
        expect(val).to.equal("bar");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(stateA);
          return Result.esucc(errB, "baz", stateB);
        });
      };

      const func = rtol(funcB, funcA);
      expect(func).to.be.a("function");
      const parser = func("foo");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(ParseError.merge(errA, errB), "baz", stateB));
    }
    // esucc, efail
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
      const funcA = val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.esucc(errA, "bar", stateA);
        });
      };

      const errB = new StrictParseError(
        new SourcePos("main", 0, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const funcB = val => {
        expect(val).to.equal("bar");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(stateA);
          return Result.efail(errB);
        });
      };

      const func = rtol(funcB, funcA);
      expect(func).to.be.a("function");
      const parser = func("foo");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(ParseError.merge(errA, errB)));
    }
    // efail, *
    {
      const errA = new StrictParseError(
        new SourcePos("main", 0, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const funcA = val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.efail(errA);
        });
      };

      const funcB = _ => assert.fail("expect function to not be called");

      const func = rtol(funcB, funcA);
      expect(func).to.be.a("function");
      const parser = func("foo");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(errA));
    }
  });
});

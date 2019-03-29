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

const { rtol } = _monad;

describe(".rtol(funA, funcB)", () => {
  it("should return composed function (like a pipe from right to left) of `funcA' and"
    + " `funcB'", () => {
    const initState = new State(
      new Config({ tabWidth: 8 }),
      "input",
      new SourcePos("foobar", 1, 1),
      "none"
    );
    // csucc, csucc
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
      const funcA = val => {
        expect(val).to.equal("nyan");
        return new StrictParser(state => {
          expect(State.equal(state, initState)).to.be.true;
          return Result.csucc(errA, "cat", stateA);
        });
      };

      const stateB = new State(
        new Config({ tabWidth: 8 }),
        "restB",
        new SourcePos("foobar", 1, 3),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("foobar", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const funcB = val => {
        expect(val).to.equal("cat");
        return new StrictParser(state => {
          expect(State.equal(state, stateA)).to.be.true;
          return Result.csucc(errB, "NYANCAT", stateB);
        });
      };

      const func = rtol(funcB, funcA);
      expect(func).to.be.a("function");
      const parser = func("nyan");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errB, "NYANCAT", stateB)
      )).to.be.true;
    }
    // csucc, cfail
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
      const funcA = val => {
        expect(val).to.equal("nyan");
        return new StrictParser(state => {
          expect(State.equal(state, initState)).to.be.true;
          return Result.csucc(errA, "cat", stateA);
        });
      };

      const errB = new StrictParseError(
        new SourcePos("foobar", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const funcB = val => {
        expect(val).to.equal("cat");
        return new StrictParser(state => {
          expect(State.equal(state, stateA)).to.be.true;
          return Result.cfail(errB);
        });
      };

      const func = rtol(funcB, funcA);
      expect(func).to.be.a("function");
      const parser = func("nyan");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errB)
      )).to.be.true;
    }
    // csucc, esucc
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
      const funcA = val => {
        expect(val).to.equal("nyan");
        return new StrictParser(state => {
          expect(State.equal(state, initState)).to.be.true;
          return Result.csucc(errA, "cat", stateA);
        });
      };

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
      const funcB = val => {
        expect(val).to.equal("cat");
        return new StrictParser(state => {
          expect(State.equal(state, stateA)).to.be.true;
          return Result.esucc(errB, "NYANCAT", stateB);
        });
      };

      const func = rtol(funcB, funcA);
      expect(func).to.be.a("function");
      const parser = func("nyan");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(ParseError.merge(errA, errB), "NYANCAT", stateB)
      )).to.be.true;
    }
    // csucc, efail
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
      const funcA = val => {
        expect(val).to.equal("nyan");
        return new StrictParser(state => {
          expect(State.equal(state, initState)).to.be.true;
          return Result.csucc(errA, "cat", stateA);
        });
      };

      const errB = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const funcB = val => {
        expect(val).to.equal("cat");
        return new StrictParser(state => {
          expect(State.equal(state, stateA)).to.be.true;
          return Result.efail(errB);
        });
      };

      const func = rtol(funcB, funcA);
      expect(func).to.be.a("function");
      const parser = func("nyan");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(errA, errB))
      )).to.be.true;
    }
    // cfail, *
    {
      const errA = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const funcA = val => {
        expect(val).to.equal("nyan");
        return new StrictParser(state => {
          expect(State.equal(state, initState)).to.be.true;
          return Result.cfail(errA);
        });
      };

      const funcB = () => { throw new Error("unexpected call"); };

      const func = rtol(funcB, funcA);
      expect(func).to.be.a("function");
      const parser = func("nyan");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errA)
      )).to.be.true;
    }
    // esucc, csucc
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
      const funcA = val => {
        expect(val).to.equal("nyan");
        return new StrictParser(state => {
          expect(State.equal(state, initState)).to.be.true;
          return Result.esucc(errA, "cat", stateA);
        });
      };

      const stateB = new State(
        new Config({ tabWidth: 8 }),
        "restB",
        new SourcePos("foobar", 1, 3),
        "someB"
      );
      const errB = new StrictParseError(
        new SourcePos("foobar", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const funcB = val => {
        expect(val).to.equal("cat");
        return new StrictParser(state => {
          expect(State.equal(state, stateA)).to.be.true;
          return Result.csucc(errB, "NYANCAT", stateB);
        });
      };

      const func = rtol(funcB, funcA);
      expect(func).to.be.a("function");
      const parser = func("nyan");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errB, "NYANCAT", stateB)
      )).to.be.true;
    }
    // esucc, cfail
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
      const funcA = val => {
        expect(val).to.equal("nyan");
        return new StrictParser(state => {
          expect(State.equal(state, initState)).to.be.true;
          return Result.esucc(errA, "cat", stateA);
        });
      };

      const errB = new StrictParseError(
        new SourcePos("foobar", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const funcB = val => {
        expect(val).to.equal("cat");
        return new StrictParser(state => {
          expect(State.equal(state, stateA)).to.be.true;
          return Result.cfail(errB);
        });
      };

      const func = rtol(funcB, funcA);
      expect(func).to.be.a("function");
      const parser = func("nyan");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errB)
      )).to.be.true;
    }
    // esucc, esucc
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
      const funcA = val => {
        expect(val).to.equal("nyan");
        return new StrictParser(state => {
          expect(State.equal(state, initState)).to.be.true;
          return Result.esucc(errA, "cat", stateA);
        });
      };

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
      const funcB = val => {
        expect(val).to.equal("cat");
        return new StrictParser(state => {
          expect(State.equal(state, stateA)).to.be.true;
          return Result.esucc(errB, "NYANCAT", stateB);
        });
      };

      const func = rtol(funcB, funcA);
      expect(func).to.be.a("function");
      const parser = func("nyan");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(ParseError.merge(errA, errB), "NYANCAT", stateB)
      )).to.be.true;
    }
    // esucc, efail
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
      const funcA = val => {
        expect(val).to.equal("nyan");
        return new StrictParser(state => {
          expect(State.equal(state, initState)).to.be.true;
          return Result.esucc(errA, "cat", stateA);
        });
      };

      const errB = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
      );
      const funcB = val => {
        expect(val).to.equal("cat");
        return new StrictParser(state => {
          expect(State.equal(state, stateA)).to.be.true;
          return Result.efail(errB);
        });
      };

      const func = rtol(funcB, funcA);
      expect(func).to.be.a("function");
      const parser = func("nyan");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(ParseError.merge(errA, errB))
      )).to.be.true;
    }
    // efail, *
    {
      const errA = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
      );
      const funcA = val => {
        expect(val).to.equal("nyan");
        return new StrictParser(state => {
          expect(State.equal(state, initState)).to.be.true;
          return Result.efail(errA);
        });
      };

      const funcB = () => { throw new Error("unexpected call"); };

      const func = rtol(funcB, funcA);
      expect(func).to.be.a("function");
      const parser = func("nyan");
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(errA)
      )).to.be.true;
    }
  });
});

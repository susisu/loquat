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

const { pure, bind } = $prim;

describe("bind", () => {
  it("should create a parser that runs a parser, gives its result to a function, and then runs a"
    + " parser returned by the function", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 1, 1),
      "none"
    );
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
    // csucc, csucc
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "foo", stateA);
      });
      const func = val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(stateA);
          return Result.csucc(errB, "bar", stateB);
        });
      };
      const binded = bind(parser, func);
      expect(binded).to.be.a.parser;
      const res = binded.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errB, "bar", stateB));
    }
    // csucc, cfail
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "foo", stateA);
      });
      const func = val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(stateA);
          return Result.cfail(errB);
        });
      };
      const binded = bind(parser, func);
      expect(binded).to.be.a.parser;
      const res = binded.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errB));
    }
    // csucc, esucc
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "foo", stateA);
      });
      const func = val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(stateA);
          return Result.esucc(errB, "bar", stateB);
        });
      };
      const binded = bind(parser, func);
      expect(binded).to.be.a.parser;
      const res = binded.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(ParseError.merge(errA, errB), "bar", stateB));
    }
    // csucc, efail
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "foo", stateA);
      });
      const func = val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(stateA);
          return Result.efail(errB);
        });
      };
      const binded = bind(parser, func);
      expect(binded).to.be.a.parser;
      const res = binded.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errA, errB)));
    }
    // cfail
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(errA);
      });
      const func = _ => assert.fail("expect function to not be called");
      const binded = bind(parser, func);
      expect(binded).to.be.a.parser;
      const res = binded.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errA));
    }
    // esucc, csucc
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "foo", stateA);
      });
      const func = val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(stateA);
          return Result.csucc(errB, "bar", stateB);
        });
      };
      const binded = bind(parser, func);
      expect(binded).to.be.a.parser;
      const res = binded.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errB, "bar", stateB));
    }
    // esucc, cfail
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "foo", stateA);
      });
      const func = val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(stateA);
          return Result.cfail(errB);
        });
      };
      const binded = bind(parser, func);
      expect(binded).to.be.a.parser;
      const res = binded.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errB));
    }
    // esucc, esucc
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "foo", stateA);
      });
      const func = val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(stateA);
          return Result.esucc(errB, "bar", stateB);
        });
      };
      const binded = bind(parser, func);
      expect(binded).to.be.a.parser;
      const res = binded.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(ParseError.merge(errA, errB), "bar", stateB));
    }
    // esucc, efail
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "foo", stateA);
      });
      const func = val => {
        expect(val).to.equal("foo");
        return new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(stateA);
          return Result.efail(errB);
        });
      };
      const binded = bind(parser, func);
      expect(binded).to.be.a.parser;
      const res = binded.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(ParseError.merge(errA, errB)));
    }
    // efail
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(errA);
      });
      const func = _ => assert.fail("expect function to not be called");
      const binded = bind(parser, func);
      expect(binded).to.be.a.parser;
      const res = binded.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(errA));
    }
  });

  it("should satisfy the monad laws", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 1, 1),
      "none"
    );
    // pure x >>= func = func x
    {
      const finalState = new State(
        new Config(),
        "rest",
        new SourcePos("main", 1, 1),
        "some"
      );
      const err = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const funcs = [
        () => new StrictParser(() => Result.csucc(err, "bar", finalState)),
        () => new StrictParser(() => Result.cfail(err)),
        () => new StrictParser(() => Result.esucc(err, "bar", finalState)),
        () => new StrictParser(() => Result.efail(err)),
      ];

      for (const func of funcs) {
        const lhs = bind(pure("foo"), func).run(initState);
        const rhs = func("foo").run(initState);
        expect(lhs).to.be.an.equalResultTo(rhs);
      }
    }
    // parser >>= pure = parser
    {
      const finalState = new State(
        new Config(),
        "rest",
        new SourcePos("main", 1, 1),
        "some"
      );
      const err = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const parsers = [
        new StrictParser(() => Result.csucc(err, "foo", finalState)),
        new StrictParser(() => Result.cfail(err)),
        new StrictParser(() => Result.esucc(err, "foo", finalState)),
        new StrictParser(() => Result.efail(err)),
      ];

      for (const parser of parsers) {
        const lhs = bind(parser, pure).run(initState);
        const rhs = parser.run(initState);
        expect(lhs).to.be.an.equalResultTo(rhs);
      }
    }
    // (parser >>= f) >>= g = parser >>= (\x -> f x >>= g)
    {
      const stateP = new State(
        new Config(),
        "restP",
        new SourcePos("main", 1, 1),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const parsers = [
        new StrictParser(() => Result.csucc(errP, "p", stateP)),
        new StrictParser(() => Result.cfail(errP)),
        new StrictParser(() => Result.esucc(errP, "p", stateP)),
        new StrictParser(() => Result.efail(errP)),
      ];

      const stateF = new State(
        new Config(),
        "restF",
        new SourcePos("main", 1, 1),
        "someF"
      );
      const errF = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testF")]
      );
      const fs = [
        () => new StrictParser(() => Result.csucc(errF, "f", stateF)),
        () => new StrictParser(() => Result.cfail(errF)),
        () => new StrictParser(() => Result.esucc(errF, "f", stateF)),
        () => new StrictParser(() => Result.efail(errF)),
      ];

      const stateG = new State(
        new Config(),
        "restG",
        new SourcePos("main", 1, 1),
        "someG"
      );
      const errG = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testG")]
      );
      const gs = [
        () => new StrictParser(() => Result.csucc(errG, "g", stateG)),
        () => new StrictParser(() => Result.cfail(errG)),
        () => new StrictParser(() => Result.esucc(errG, "g", stateG)),
        () => new StrictParser(() => Result.efail(errG)),
      ];

      for (const parser of parsers) {
        for (const f of fs) {
          for (const g of gs) {
            const lhs = bind(bind(parser, f), g).run(initState);
            const rhs = bind(parser, x => bind(f(x), g)).run(initState);
            expect(lhs).to.be.an.equalResultTo(rhs);
          }
        }
      }
    }
  });
});

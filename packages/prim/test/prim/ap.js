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

const { pure, ap } = $prim;

describe("ap", () => {
  it("should create a parser that runs two parsers sequentially and then applies the result of the"
    + " former one as a function to the latter one", () => {
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
        return Result.csucc(
          errA,
          x => {
            expect(x).to.equal("foo");
            return "bar";
          },
          stateA
        );
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.csucc(errB, "foo", stateB);
      });
      const composed = ap(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errB, "bar", stateB));
    }
    // csucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(
          errA,
          _ => assert.fail("expect function to not be called"),
          stateA
        );
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.cfail(errB);
      });
      const composed = ap(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errB));
    }
    // csucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(
          errA,
          x => {
            expect(x).to.equal("foo");
            return "bar";
          },
          stateA
        );
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.esucc(errB, "foo", stateB);
      });
      const composed = ap(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(ParseError.merge(errA, errB), "bar", stateB));
    }
    // csucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(
          errA,
          _ => assert.fail("expect function to not be called"),
          stateA
        );
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.efail(errB);
      });
      const composed = ap(parserA, parserB);
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
      const parserB = new StrictParser(_ => assert.fail("expect function to not be called"));
      const composed = ap(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errA));
    }
    // esucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(
          errA,
          x => {
            expect(x).to.equal("foo");
            return "bar";
          },
          stateA
        );
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.csucc(errB, "foo", stateB);
      });
      const composed = ap(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errB, "bar", stateB));
    }
    // esucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(
          errA,
          _ => assert.fail("expect function to not be called"),
          stateA
        );
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.cfail(errB);
      });
      const composed = ap(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errB));
    }
    // esucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(
          errA,
          x => {
            expect(x).to.equal("foo");
            return "bar";
          },
          stateA
        );
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.esucc(errB, "foo", stateB);
      });
      const composed = ap(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(ParseError.merge(errA, errB), "bar", stateB));
    }
    // esucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(
          errA,
          _ => assert.fail("expect function to not be called"),
          stateA
        );
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.efail(errB);
      });
      const composed = ap(parserA, parserB);
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
      const parserB = new StrictParser(_ => assert.fail("expect function to not be called"));
      const composed = ap(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(errA));
    }
  });

  it("should satisfy the applicative functor laws", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    // pure id <*> parser = parser
    {
      const id = x => x;

      const finalState = new State(
        new Config(),
        "rest",
        new SourcePos("main", 0, 1, 1),
        "some"
      );
      const err = new StrictParseError(
        new SourcePos("main", 0, 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const parsers = [
        new StrictParser(() => Result.csucc(err, "foo", finalState)),
        new StrictParser(() => Result.cfail(err)),
        new StrictParser(() => Result.esucc(err, "foo", finalState)),
        new StrictParser(() => Result.efail(err)),
      ];

      for (const parser of parsers) {
        const lhs = ap(pure(id), parser).run(initState);
        const rhs = parser.run(initState);
        expect(lhs).to.be.an.equalResultTo(rhs);
      }
    }
    // pure (.) <*> u <*> v <*> w = u <*> (v <*> w)
    {
      const compose = f => g => x => f(g(x));

      const stateU = new State(
        new Config(),
        "restU",
        new SourcePos("main", 0, 1, 1),
        "someU"
      );
      const errU = new StrictParseError(
        new SourcePos("main", 0, 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testU")]
      );
      const us = [
        new StrictParser(() => Result.csucc(errU, x => x.toUpperCase(), stateU)),
        new StrictParser(() => Result.cfail(errU)),
        new StrictParser(() => Result.esucc(errU, x => x.toUpperCase(), stateU)),
        new StrictParser(() => Result.efail(errU)),
      ];

      const stateV = new State(
        new Config(),
        "restV",
        new SourcePos("main", 0, 1, 1),
        "someV"
      );
      const errV = new StrictParseError(
        new SourcePos("main", 0, 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testV")]
      );
      const vs = [
        new StrictParser(() => Result.csucc(errV, x => x + "bar", stateV)),
        new StrictParser(() => Result.cfail(errV)),
        new StrictParser(() => Result.esucc(errV, x => x + "bar", stateV)),
        new StrictParser(() => Result.efail(errV)),
      ];

      const stateW = new State(
        new Config(),
        "restW",
        new SourcePos("main", 0, 1, 1),
        "someW"
      );
      const errW = new StrictParseError(
        new SourcePos("main", 0, 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testW")]
      );
      const ws = [
        new StrictParser(() => Result.csucc(errW, "foo", stateW)),
        new StrictParser(() => Result.cfail(errW)),
        new StrictParser(() => Result.esucc(errW, "foo", stateW)),
        new StrictParser(() => Result.efail(errW)),
      ];

      for (const u of us) {
        for (const v of vs) {
          for (const w of ws) {
            const lhs = ap(ap(ap(pure(compose), u), v), w).run(initState);
            const rhs = ap(u, ap(v, w)).run(initState);
            expect(lhs).to.be.an.equalResultTo(rhs);
          }
        }
      }
    }
    // pure f <*> pure x = pure (f x)
    {
      const f = x => x.toUpperCase();
      const x = "foo";

      const lhs = ap(pure(f), pure(x)).run(initState);
      const rhs = pure(f(x)).run(initState);

      expect(lhs).to.be.an.equalResultTo(rhs);
    }
    // parser <*> pure x = pure ($ x) <*> parser
    {
      const flipApply = x => f => f(x);

      const finalState = new State(
        new Config(),
        "rest",
        new SourcePos("main", 0, 1, 1),
        "some"
      );
      const err = new StrictParseError(
        new SourcePos("main", 0, 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const parsers = [
        new StrictParser(() => Result.csucc(err, x => x.toUpperCase(), finalState)),
        new StrictParser(() => Result.cfail(err)),
        new StrictParser(() => Result.esucc(err, x => x.toUpperCase(), finalState)),
        new StrictParser(() => Result.efail(err)),
      ];

      const x = "foo";

      for (const parser of parsers) {
        const lhs = ap(parser, pure(x)).run(initState);
        const rhs = ap(pure(flipApply(x)), parser).run(initState);
        expect(lhs).to.be.an.equalResultTo(rhs);
      }
    }
  });
});

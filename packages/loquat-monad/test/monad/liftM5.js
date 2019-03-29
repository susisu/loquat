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

const { liftM5 } = _monad;

describe(".liftM5(func)", () => {
  it("should lift a function `func' to a function from five parsers to a parser", () => {
    const func = (a, b, c, d, e) =>
      a.toUpperCase() + b.toLowerCase() + c.toUpperCase() + d.toLowerCase() + e.toUpperCase();
    const liftedFunc = liftM5(func);
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
    const stateC = new State(
      new Config({ tabWidth: 4 }),
      "restC",
      new SourcePos("foobar", 1, 1),
      "someC"
    );
    const errC = new StrictParseError(
      new SourcePos("foobar", 1, 1),
      [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
    );
    const stateD = new State(
      new Config({ tabWidth: 4 }),
      "restD",
      new SourcePos("foobar", 1, 1),
      "someD"
    );
    const errD = new StrictParseError(
      new SourcePos("foobar", 1, 1),
      [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
    );
    const stateE = new State(
      new Config({ tabWidth: 4 }),
      "restE",
      new SourcePos("foobar", 1, 1),
      "someE"
    );
    const errE = new StrictParseError(
      new SourcePos("foobar", 1, 1),
      [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
    );
    // csucc, csucc, csucc, csucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errE, "AbCdE", stateE)
      )).to.be.true;
    }
    // csucc, csucc, csucc, csucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errE)
      )).to.be.true;
    }
    // csucc, csucc, csucc, csucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(ParseError.merge(errD, errE), "AbCdE", stateE)
      )).to.be.true;
    }
    // csucc, csucc, csucc, csucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(errD, errE))
      )).to.be.true;
    }
    // csucc, csucc, csucc, cfail, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.cfail(errD);
      });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errD)
      )).to.be.true;
    }
    // csucc, csucc, csucc, esucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errE, "AbCdE", stateE)
      )).to.be.true;
    }
    // csucc, csucc, csucc, esucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errE)
      )).to.be.true;
    }
    // csucc, csucc, csucc, esucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(ParseError.merge(ParseError.merge(errC, errD), errE), "AbCdE", stateE)
      )).to.be.true;
    }
    // csucc, csucc, csucc, esucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(ParseError.merge(errC, errD), errE))
      )).to.be.true;
    }
    // csucc, csucc, csucc, efail, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.efail(errD);
      });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(errC, errD))
      )).to.be.true;
    }
    // csucc, csucc, cfail, *, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.cfail(errC);
      });
      const parserD = new StrictParser(() => { throw new Error("unexpected call"); });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errC)
      )).to.be.true;
    }
    // csucc, csucc, esucc, csucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errE, "AbCdE", stateE)
      )).to.be.true;
    }
    // csucc, csucc, esucc, csucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errE)
      )).to.be.true;
    }
    // csucc, csucc, esucc, csucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(ParseError.merge(errD, errE), "AbCdE", stateE)
      )).to.be.true;
    }
    // csucc, csucc, esucc, csucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(errD, errE))
      )).to.be.true;
    }
    // csucc, csucc, esucc, cfail, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.cfail(errD);
      });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errD)
      )).to.be.true;
    }
    // csucc, csucc, esucc, esucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errE, "AbCdE", stateE)
      )).to.be.true;
    }
    // csucc, csucc, esucc, esucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errE)
      )).to.be.true;
    }
    // csucc, csucc, esucc, esucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          ParseError.merge(ParseError.merge(ParseError.merge(errB, errC), errD), errE),
          "AbCdE",
          stateE
        )
      )).to.be.true;
    }
    // csucc, csucc, esucc, esucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(ParseError.merge(ParseError.merge(errB, errC), errD), errE))
      )).to.be.true;
    }
    // csucc, csucc, esucc, efail, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.efail(errD);
      });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(ParseError.merge(errB, errC), errD))
      )).to.be.true;
    }
    // csucc, csucc, efail, *, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.efail(errC);
      });
      const parserD = new StrictParser(() => { throw new Error("unexpected call"); });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(errB, errC))
      )).to.be.true;
    }
    // csucc, cfail, *, *, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.cfail(errB);
      });
      const parserC = new StrictParser(() => { throw new Error("unexpected call"); });
      const parserD = new StrictParser(() => { throw new Error("unexpected call"); });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errB)
      )).to.be.true;
    }
    // csucc, esucc, csucc, csucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errE, "AbCdE", stateE)
      )).to.be.true;
    }
    // csucc, esucc, csucc, csucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errE)
      )).to.be.true;
    }
    // csucc, esucc, csucc, csucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(ParseError.merge(errD, errE), "AbCdE", stateE)
      )).to.be.true;
    }
    // csucc, esucc, csucc, csucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(errD, errE))
      )).to.be.true;
    }
    // csucc, esucc, csucc, cfail, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.cfail(errD);
      });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errD)
      )).to.be.true;
    }
    // csucc, esucc, csucc, esucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errE, "AbCdE", stateE)
      )).to.be.true;
    }
    // csucc, esucc, csucc, esucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errE)
      )).to.be.true;
    }
    // csucc, esucc, csucc, esucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(ParseError.merge(ParseError.merge(errC, errD), errE), "AbCdE", stateE)
      )).to.be.true;
    }
    // csucc, esucc, csucc, esucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(ParseError.merge(errC, errD), errE))
      )).to.be.true;
    }
    // csucc, esucc, csucc, efail, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.efail(errD);
      });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(errC, errD))
      )).to.be.true;
    }
    // csucc, esucc, cfail, *, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.cfail(errC);
      });
      const parserD = new StrictParser(() => { throw new Error("unexpected call"); });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errC)
      )).to.be.true;
    }
    // csucc, esucc, esucc, csucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errE, "AbCdE", stateE)
      )).to.be.true;
    }
    // csucc, esucc, esucc, csucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errE)
      )).to.be.true;
    }
    // csucc, esucc, esucc, csucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(ParseError.merge(errD, errE), "AbCdE", stateE)
      )).to.be.true;
    }
    // csucc, esucc, esucc, csucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(errD, errE))
      )).to.be.true;
    }
    // csucc, esucc, esucc, cfail, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.cfail(errD);
      });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errD)
      )).to.be.true;
    }
    // csucc, esucc, esucc, esucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errE, "AbCdE", stateE)
      )).to.be.true;
    }
    // csucc, esucc, esucc, esucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errE)
      )).to.be.true;
    }
    // csucc, esucc, esucc, esucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          ParseError.merge(
            ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD),
            errE
          ),
          "AbCdE",
          stateE
        )
      )).to.be.true;
    }
    // csucc, esucc, esucc, esucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(
          ParseError.merge(
            ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD),
            errE
          )
        )
      )).to.be.true;
    }
    // csucc, esucc, esucc, efail, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.efail(errD);
      });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD))
      )).to.be.true;
    }
    // csucc, esucc, efail, *, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.efail(errC);
      });
      const parserD = new StrictParser(() => { throw new Error("unexpected call"); });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(ParseError.merge(errA, errB), errC))
      )).to.be.true;
    }
    // csucc, efail, *, *, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.efail(errB);
      });
      const parserC = new StrictParser(() => { throw new Error("unexpected call"); });
      const parserD = new StrictParser(() => { throw new Error("unexpected call"); });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(errA, errB))
      )).to.be.true;
    }
    // cfail, *, *, *, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.cfail(errA);
      });
      const parserB = new StrictParser(() => { throw new Error("unexpected call"); });
      const parserC = new StrictParser(() => { throw new Error("unexpected call"); });
      const parserD = new StrictParser(() => { throw new Error("unexpected call"); });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errA)
      )).to.be.true;
    }
    // esucc, csucc, csucc, csucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errE, "AbCdE", stateE)
      )).to.be.true;
    }
    // esucc, csucc, csucc, csucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errE)
      )).to.be.true;
    }
    // esucc, csucc, csucc, csucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(ParseError.merge(errD, errE), "AbCdE", stateE)
      )).to.be.true;
    }
    // esucc, csucc, csucc, csucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(errD, errE))
      )).to.be.true;
    }
    // esucc, csucc, csucc, cfail, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.cfail(errD);
      });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errD)
      )).to.be.true;
    }
    // esucc, csucc, csucc, esucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errE, "AbCdE", stateE)
      )).to.be.true;
    }
    // esucc, csucc, csucc, esucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errE)
      )).to.be.true;
    }
    // esucc, csucc, csucc, esucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(ParseError.merge(ParseError.merge(errC, errD), errE), "AbCdE", stateE)
      )).to.be.true;
    }
    // esucc, csucc, csucc, esucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(ParseError.merge(errC, errD), errE))
      )).to.be.true;
    }
    // esucc, csucc, csucc, efail, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.efail(errD);
      });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(errC, errD))
      )).to.be.true;
    }
    // esucc, csucc, cfail, *, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.cfail(errC);
      });
      const parserD = new StrictParser(() => { throw new Error("unexpected call"); });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errC)
      )).to.be.true;
    }
    // esucc, csucc, esucc, csucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errE, "AbCdE", stateE)
      )).to.be.true;
    }
    // esucc, csucc, esucc, csucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errE)
      )).to.be.true;
    }
    // esucc, csucc, esucc, csucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(ParseError.merge(errD, errE), "AbCdE", stateE)
      )).to.be.true;
    }
    // esucc, csucc, esucc, csucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(errD, errE))
      )).to.be.true;
    }
    // esucc, csucc, esucc, cfail, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.cfail(errD);
      });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errD)
      )).to.be.true;
    }
    // esucc, csucc, esucc, esucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errE, "AbCdE", stateE)
      )).to.be.true;
    }
    // esucc, csucc, esucc, esucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errE)
      )).to.be.true;
    }
    // esucc, csucc, esucc, esucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(
          ParseError.merge(ParseError.merge(ParseError.merge(errB, errC), errD), errE),
          "AbCdE",
          stateE
        )
      )).to.be.true;
    }
    // esucc, csucc, esucc, esucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(ParseError.merge(ParseError.merge(errB, errC), errD), errE))
      )).to.be.true;
    }
    // esucc, csucc, esucc, efail, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.efail(errD);
      });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(ParseError.merge(errB, errC), errD))
      )).to.be.true;
    }
    // esucc, csucc, efail, *, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.efail(errC);
      });
      const parserD = new StrictParser(() => { throw new Error("unexpected call"); });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(errB, errC))
      )).to.be.true;
    }
    // esucc, cfail, *, *, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.cfail(errB);
      });
      const parserC = new StrictParser(() => { throw new Error("unexpected call"); });
      const parserD = new StrictParser(() => { throw new Error("unexpected call"); });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errB)
      )).to.be.true;
    }
    // esucc, esucc, csucc, csucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errE, "AbCdE", stateE)
      )).to.be.true;
    }
    // esucc, esucc, csucc, csucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errE)
      )).to.be.true;
    }
    // esucc, esucc, csucc, csucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(ParseError.merge(errD, errE), "AbCdE", stateE)
      )).to.be.true;
    }
    // esucc, esucc, csucc, csucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(errD, errE))
      )).to.be.true;
    }
    // esucc, esucc, csucc, cfail, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.cfail(errD);
      });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errD)
      )).to.be.true;
    }
    // esucc, esucc, csucc, esucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errE, "AbCdE", stateE)
      )).to.be.true;
    }
    // esucc, esucc, csucc, esucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errE)
      )).to.be.true;
    }
    // esucc, esucc, csucc, esucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(ParseError.merge(ParseError.merge(errC, errD), errE), "AbCdE", stateE)
      )).to.be.true;
    }
    // esucc, esucc, csucc, esucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(ParseError.merge(errC, errD), errE))
      )).to.be.true;
    }
    // esucc, esucc, csucc, efail, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.csucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.efail(errD);
      });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(errC, errD))
      )).to.be.true;
    }
    // esucc, esucc, cfail, *, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.cfail(errC);
      });
      const parserD = new StrictParser(() => { throw new Error("unexpected call"); });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errC)
      )).to.be.true;
    }
    // esucc, esucc, esucc, csucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errE, "AbCdE", stateE)
      )).to.be.true;
    }
    // esucc, esucc, esucc, csucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errE)
      )).to.be.true;
    }
    // esucc, esucc, esucc, csucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(ParseError.merge(errD, errE), "AbCdE", stateE)
      )).to.be.true;
    }
    // esucc, esucc, esucc, csucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(errD, errE))
      )).to.be.true;
    }
    // esucc, esucc, esucc, cfail, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.cfail(errD);
      });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errD)
      )).to.be.true;
    }
    // esucc, esucc, esucc, esucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errE, "AbCdE", stateE)
      )).to.be.true;
    }
    // esucc, esucc, esucc, esucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errE)
      )).to.be.true;
    }
    // esucc, esucc, esucc, esucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(
          ParseError.merge(
            ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD),
            errE
          ),
          "AbCdE",
          stateE
        )
      )).to.be.true;
    }
    // esucc, esucc, esucc, esucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(State.equal(state, stateD)).to.be.true;
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          ParseError.merge(
            ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD),
            errE
          )
        )
      )).to.be.true;
    }
    // esucc, esucc, esucc, efail, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.esucc(errC, "c", stateC);
      });
      const parserD = new StrictParser(state => {
        expect(State.equal(state, stateC)).to.be.true;
        return Result.efail(errD);
      });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD))
      )).to.be.true;
    }
    // esucc, esucc, efail, *, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(State.equal(state, stateB)).to.be.true;
        return Result.efail(errC);
      });
      const parserD = new StrictParser(() => { throw new Error("unexpected call"); });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(ParseError.merge(ParseError.merge(errA, errB), errC))
      )).to.be.true;
    }
    // esucc, efail, *, *, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.efail(errB);
      });
      const parserC = new StrictParser(() => { throw new Error("unexpected call"); });
      const parserD = new StrictParser(() => { throw new Error("unexpected call"); });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(ParseError.merge(errA, errB))
      )).to.be.true;
    }
    // efail, *, *, *, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.efail(errA);
      });
      const parserB = new StrictParser(() => { throw new Error("unexpected call"); });
      const parserC = new StrictParser(() => { throw new Error("unexpected call"); });
      const parserD = new StrictParser(() => { throw new Error("unexpected call"); });
      const parserE = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(errA)
      )).to.be.true;
    }
  });
});

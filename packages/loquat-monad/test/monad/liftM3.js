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

const { liftM3 } = _monad;

describe(".liftM3(func)", () => {
  it("should lift a function `func' to a function from three parsers to a parser", () => {
    const func = (x, y, z) => x.toUpperCase() + y.toLowerCase() + z.toUpperCase();
    const liftedFunc = liftM3(func);
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
    // csucc, csucc, csucc
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
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errC, "AbC", stateC)
      )).to.be.true;
    }
    // csucc, csucc, cfail
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
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errC)
      )).to.be.true;
    }
    // csucc, csucc, esucc
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
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(ParseError.merge(errB, errC), "AbC", stateC)
      )).to.be.true;
    }
    // csucc, csucc, efail
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
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(errB, errC))
      )).to.be.true;
    }
    // csucc, cfail, *
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
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errB)
      )).to.be.true;
    }
    // csucc, esucc, csucc
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
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errC, "AbC", stateC)
      )).to.be.true;
    }
    // csucc, esucc, cfail
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
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errC)
      )).to.be.true;
    }
    // csucc, esucc, esucc
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
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(ParseError.merge(ParseError.merge(errA, errB), errC), "AbC", stateC)
      )).to.be.true;
    }
    // csucc, esucc, efail
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
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(ParseError.merge(errA, errB), errC))
      )).to.be.true;
    }
    // csucc, efail, *
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
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(errA, errB))
      )).to.be.true;
    }
    // cfail, *, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.cfail(errA);
      });
      const parserB = new StrictParser(() => { throw new Error("unexpected call"); });
      const parserC = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errA)
      )).to.be.true;
    }
    // esucc, csucc, csucc
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
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errC, "AbC", stateC)
      )).to.be.true;
    }
    // esucc, csucc, cfail
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
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errC)
      )).to.be.true;
    }
    // esucc, csucc, esucc
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
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(ParseError.merge(errB, errC), "AbC", stateC)
      )).to.be.true;
    }
    // esucc, csucc, efail
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
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(errB, errC))
      )).to.be.true;
    }
    // esucc, cfail, *
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
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errB)
      )).to.be.true;
    }
    // esucc, esucc, csucc
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
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errC, "AbC", stateC)
      )).to.be.true;
    }
    // esucc, esucc, cfail
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
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errC)
      )).to.be.true;
    }
    // esucc, esucc, esucc
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
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(ParseError.merge(ParseError.merge(errA, errB), errC), "AbC", stateC)
      )).to.be.true;
    }
    // esucc, esucc, efail
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
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(ParseError.merge(ParseError.merge(errA, errB), errC))
      )).to.be.true;
    }
    // esucc, efail, *
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
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(ParseError.merge(errA, errB))
      )).to.be.true;
    }
    // efail, *, *
    {
      const parserA = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.efail(errA);
      });
      const parserB = new StrictParser(() => { throw new Error("unexpected call"); });
      const parserC = new StrictParser(() => { throw new Error("unexpected call"); });
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(errA)
      )).to.be.true;
    }
  });
});

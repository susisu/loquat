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

const { liftM3 } = _monad;

describe("liftM3", () => {
  it("should lift a ternary function on values to a function on parsers", () => {
    const func = (x, y, z) => x.toUpperCase() + y.toLowerCase() + z.toUpperCase();
    const liftedFunc = liftM3(func);
    expect(liftedFunc).is.a("function");

    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    const stateA = new State(
      new Config(),
      "restA",
      new SourcePos("main", 0, 1, 1),
      "someA"
    );
    const errA = new StrictParseError(
      new SourcePos("main", 0, 1, 1),
      [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
    );
    const stateB = new State(
      new Config(),
      "restB",
      new SourcePos("main", 0, 1, 1),
      "someB"
    );
    const errB = new StrictParseError(
      new SourcePos("main", 0, 1, 1),
      [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
    );
    const stateC = new State(
      new Config(),
      "restC",
      new SourcePos("main", 0, 1, 1),
      "someC"
    );
    const errC = new StrictParseError(
      new SourcePos("main", 0, 1, 1),
      [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
    );
    // csucc, csucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateB);
        return Result.csucc(errC, "c", stateC);
      });
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errC, "AbC", stateC));
    }
    // csucc, csucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateB);
        return Result.cfail(errC);
      });
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errC));
    }
    // csucc, csucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateB);
        return Result.esucc(errC, "c", stateC);
      });
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(ParseError.merge(errB, errC), "AbC", stateC));
    }
    // csucc, csucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateB);
        return Result.efail(errC);
      });
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errB, errC)));
    }
    // csucc, cfail, *
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.cfail(errB);
      });
      const parserC = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errB));
    }
    // csucc, esucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateB);
        return Result.csucc(errC, "c", stateC);
      });
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errC, "AbC", stateC));
    }
    // csucc, esucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateB);
        return Result.cfail(errC);
      });
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errC));
    }
    // csucc, esucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateB);
        return Result.esucc(errC, "c", stateC);
      });
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(ParseError.merge(errA, errB), errC),
        "AbC",
        stateC
      ));
    }
    // csucc, esucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateB);
        return Result.efail(errC);
      });
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        ParseError.merge(ParseError.merge(errA, errB), errC)
      ));
    }
    // csucc, efail, *
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.efail(errB);
      });
      const parserC = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errA, errB)));
    }
    // cfail, *, *
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(errA);
      });
      const parserB = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parserC = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errA));
    }
    // esucc, csucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateB);
        return Result.csucc(errC, "c", stateC);
      });
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errC, "AbC", stateC));
    }
    // esucc, csucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateB);
        return Result.cfail(errC);
      });
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errC));
    }
    // esucc, csucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateB);
        return Result.esucc(errC, "c", stateC);
      });
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(ParseError.merge(errB, errC), "AbC", stateC));
    }
    // esucc, csucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.csucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateB);
        return Result.efail(errC);
      });
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errB, errC)));
    }
    // esucc, cfail, *
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.cfail(errB);
      });
      const parserC = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errB));
    }
    // esucc, esucc, csucc
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateB);
        return Result.csucc(errC, "c", stateC);
      });
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errC, "AbC", stateC));
    }
    // esucc, esucc, cfail
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateB);
        return Result.cfail(errC);
      });
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errC));
    }
    // esucc, esucc, esucc
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateB);
        return Result.esucc(errC, "c", stateC);
      });
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(
        ParseError.merge(ParseError.merge(errA, errB), errC),
        "AbC",
        stateC
      ));
    }
    // esucc, esucc, efail
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.esucc(errB, "B", stateB);
      });
      const parserC = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateB);
        return Result.efail(errC);
      });
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        ParseError.merge(ParseError.merge(errA, errB), errC)
      ));
    }
    // esucc, efail, *
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.efail(errB);
      });
      const parserC = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(ParseError.merge(errA, errB)));
    }
    // efail, *, *
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(errA);
      });
      const parserB = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parserC = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(errA));
    }
  });
});

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

const { liftM5 } = $monad;

describe("liftM5", () => {
  it("should lift a 5-ary function on values to a function on parsers", () => {
    const func = (a, b, c, d, e) =>
      a.toUpperCase() + b.toLowerCase() + c.toUpperCase() + d.toLowerCase() + e.toUpperCase();
    const liftedFunc = liftM5(func);
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
    const stateD = new State(
      new Config(),
      "restD",
      new SourcePos("main", 0, 1, 1),
      "someD"
    );
    const errD = new StrictParseError(
      new SourcePos("main", 0, 1, 1),
      [ErrorMessage.create(ErrorMessageType.MESSAGE, "testD")]
    );
    const stateE = new State(
      new Config(),
      "restE",
      new SourcePos("main", 0, 1, 1),
      "someE"
    );
    const errE = new StrictParseError(
      new SourcePos("main", 0, 1, 1),
      [ErrorMessage.create(ErrorMessageType.MESSAGE, "testE")]
    );
    // csucc, csucc, csucc, csucc, csucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errE, "AbCdE", stateE));
    }
    // csucc, csucc, csucc, csucc, cfail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errE));
    }
    // csucc, csucc, csucc, csucc, esucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(errD, errE),
        "AbCdE",
        stateE
      ));
    }
    // csucc, csucc, csucc, csucc, efail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errD, errE)));
    }
    // csucc, csucc, csucc, cfail, *
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.cfail(errD);
      });
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errD));
    }
    // csucc, csucc, csucc, esucc, csucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errE, "AbCdE", stateE));
    }
    // csucc, csucc, csucc, esucc, cfail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errE));
    }
    // csucc, csucc, csucc, esucc, esucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(ParseError.merge(errC, errD), errE),
        "AbCdE",
        stateE
      ));
    }
    // csucc, csucc, csucc, esucc, efail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        ParseError.merge(ParseError.merge(errC, errD), errE)
      ));
    }
    // csucc, csucc, csucc, efail, *
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.efail(errD);
      });
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errC, errD)));
    }
    // csucc, csucc, cfail, *, *
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
      const parserD = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errC));
    }
    // csucc, csucc, esucc, csucc, csucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errE, "AbCdE", stateE));
    }
    // csucc, csucc, esucc, csucc, cfail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errE));
    }
    // csucc, csucc, esucc, csucc, esucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(errD, errE),
        "AbCdE",
        stateE
      ));
    }
    // csucc, csucc, esucc, csucc, efail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errD, errE)));
    }
    // csucc, csucc, esucc, cfail, *
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.cfail(errD);
      });
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errD));
    }
    // csucc, csucc, esucc, esucc, csucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errE, "AbCdE", stateE));
    }
    // csucc, csucc, esucc, esucc, cfail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errE));
    }
    // csucc, csucc, esucc, esucc, esucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(ParseError.merge(ParseError.merge(errB, errC), errD), errE),
        "AbCdE",
        stateE
      ));
    }
    // csucc, csucc, esucc, esucc, efail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        ParseError.merge(ParseError.merge(ParseError.merge(errB, errC), errD), errE)
      ));
    }
    // csucc, csucc, esucc, efail, *
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.efail(errD);
      });
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        ParseError.merge(ParseError.merge(errB, errC), errD)
      ));
    }
    // csucc, csucc, efail, *, *
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
      const parserD = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errB, errC)));
    }
    // csucc, cfail, *, *, *
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
      const parserD = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errB));
    }
    // csucc, esucc, csucc, csucc, csucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errE, "AbCdE", stateE));
    }
    // csucc, esucc, csucc, csucc, cfail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errE));
    }
    // csucc, esucc, csucc, csucc, esucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(errD, errE),
        "AbCdE",
        stateE
      ));
    }
    // csucc, esucc, csucc, csucc, efail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errD, errE)));
    }
    // csucc, esucc, csucc, cfail, *
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.cfail(errD);
      });
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errD));
    }
    // csucc, esucc, csucc, esucc, csucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errE, "AbCdE", stateE));
    }
    // csucc, esucc, csucc, esucc, cfail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errE));
    }
    // csucc, esucc, csucc, esucc, esucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(ParseError.merge(errC, errD), errE),
        "AbCdE",
        stateE
      ));
    }
    // csucc, esucc, csucc, esucc, efail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        ParseError.merge(ParseError.merge(errC, errD), errE)
      ));
    }
    // csucc, esucc, csucc, efail, *
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.efail(errD);
      });
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errC, errD)));
    }
    // csucc, esucc, cfail, *, *
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
      const parserD = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errC));
    }
    // csucc, esucc, esucc, csucc, csucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errE, "AbCdE", stateE));
    }
    // csucc, esucc, esucc, csucc, cfail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errE));
    }
    // csucc, esucc, esucc, csucc, esucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(errD, errE),
        "AbCdE",
        stateE
      ));
    }
    // csucc, esucc, esucc, csucc, efail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errD, errE)));
    }
    // csucc, esucc, esucc, cfail, *
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.cfail(errD);
      });
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errD));
    }
    // csucc, esucc, esucc, esucc, csucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errE, "AbCdE", stateE));
    }
    // csucc, esucc, esucc, esucc, cfail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errE));
    }
    // csucc, esucc, esucc, esucc, esucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(
          ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD),
          errE
        ),
        "AbCdE",
        stateE
      ));
    }
    // csucc, esucc, esucc, esucc, efail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        ParseError.merge(
          ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD),
          errE
        )
      ));
    }
    // csucc, esucc, esucc, efail, *
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.efail(errD);
      });
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD)
      ));
    }
    // csucc, esucc, efail, *, *
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
      const parserD = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        ParseError.merge(ParseError.merge(errA, errB), errC)
      ));
    }
    // csucc, efail, *, *, *
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
      const parserD = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errA, errB)));
    }
    // cfail, *, *, *, *
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(errA);
      });
      const parserB = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parserC = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parserD = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errA));
    }
    // esucc, csucc, csucc, csucc, csucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errE, "AbCdE", stateE));
    }
    // esucc, csucc, csucc, csucc, cfail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errE));
    }
    // esucc, csucc, csucc, csucc, esucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(errD, errE),
        "AbCdE",
        stateE
      ));
    }
    // esucc, csucc, csucc, csucc, efail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errD, errE)));
    }
    // esucc, csucc, csucc, cfail, *
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.cfail(errD);
      });
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errD));
    }
    // esucc, csucc, csucc, esucc, csucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errE, "AbCdE", stateE));
    }
    // esucc, csucc, csucc, esucc, cfail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errE));
    }
    // esucc, csucc, csucc, esucc, esucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(ParseError.merge(errC, errD), errE),
        "AbCdE",
        stateE
      ));
    }
    // esucc, csucc, csucc, esucc, efail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        ParseError.merge(ParseError.merge(errC, errD), errE)
      ));
    }
    // esucc, csucc, csucc, efail, *
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.efail(errD);
      });
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errC, errD)));
    }
    // esucc, csucc, cfail, *, *
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
      const parserD = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errC));
    }
    // esucc, csucc, esucc, csucc, csucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errE, "AbCdE", stateE));
    }
    // esucc, csucc, esucc, csucc, cfail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errE));
    }
    // esucc, csucc, esucc, csucc, esucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(errD, errE),
        "AbCdE",
        stateE
      ));
    }
    // esucc, csucc, esucc, csucc, efail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errD, errE)));
    }
    // esucc, csucc, esucc, cfail, *
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.cfail(errD);
      });
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errD));
    }
    // esucc, csucc, esucc, esucc, csucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errE, "AbCdE", stateE));
    }
    // esucc, csucc, esucc, esucc, cfail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errE));
    }
    // esucc, csucc, esucc, esucc, esucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(ParseError.merge(ParseError.merge(errB, errC), errD), errE),
        "AbCdE",
        stateE
      ));
    }
    // esucc, csucc, esucc, esucc, efail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        ParseError.merge(ParseError.merge(ParseError.merge(errB, errC), errD), errE)
      ));
    }
    // esucc, csucc, esucc, efail, *
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.efail(errD);
      });
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        ParseError.merge(ParseError.merge(errB, errC), errD)
      ));
    }
    // esucc, csucc, efail, *, *
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
      const parserD = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errB, errC)));
    }
    // esucc, cfail, *, *, *
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
      const parserD = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errB));
    }
    // esucc, esucc, csucc, csucc, csucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errE, "AbCdE", stateE));
    }
    // esucc, esucc, csucc, csucc, cfail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errE));
    }
    // esucc, esucc, csucc, csucc, esucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(errD, errE),
        "AbCdE",
        stateE
      ));
    }
    // esucc, esucc, csucc, csucc, efail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errD, errE)));
    }
    // esucc, esucc, csucc, cfail, *
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.cfail(errD);
      });
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errD));
    }
    // esucc, esucc, csucc, esucc, csucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errE, "AbCdE", stateE));
    }
    // esucc, esucc, csucc, esucc, cfail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errE));
    }
    // esucc, esucc, csucc, esucc, esucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(ParseError.merge(errC, errD), errE),
        "AbCdE",
        stateE
      ));
    }
    // esucc, esucc, csucc, esucc, efail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        ParseError.merge(ParseError.merge(errC, errD), errE)
      ));
    }
    // esucc, esucc, csucc, efail, *
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.efail(errD);
      });
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errC, errD)));
    }
    // esucc, esucc, cfail, *, *
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
      const parserD = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errC));
    }
    // esucc, esucc, esucc, csucc, csucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errE, "AbCdE", stateE));
    }
    // esucc, esucc, esucc, csucc, cfail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errE));
    }
    // esucc, esucc, esucc, csucc, esucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(errD, errE),
        "AbCdE",
        stateE
      ));
    }
    // esucc, esucc, esucc, csucc, efail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.csucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errD, errE)));
    }
    // esucc, esucc, esucc, cfail, *
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.cfail(errD);
      });
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errD));
    }
    // esucc, esucc, esucc, esucc, csucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.csucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errE, "AbCdE", stateE));
    }
    // esucc, esucc, esucc, esucc, cfail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.cfail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errE));
    }
    // esucc, esucc, esucc, esucc, esucc
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.esucc(errE, "e", stateE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(
        ParseError.merge(
          ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD),
          errE
        ),
        "AbCdE",
        stateE
      ));
    }
    // esucc, esucc, esucc, esucc, efail
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.esucc(errD, "D", stateD);
      });
      const parserE = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateD);
        return Result.efail(errE);
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        ParseError.merge(
          ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD),
          errE
        )
      ));
    }
    // esucc, esucc, esucc, efail, *
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
      const parserD = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateC);
        return Result.efail(errD);
      });
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD)
      ));
    }
    // esucc, esucc, efail, *, *
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
      const parserD = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        ParseError.merge(ParseError.merge(errA, errB), errC)
      ));
    }
    // esucc, efail, *, *, *
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
      const parserD = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(ParseError.merge(errA, errB)));
    }
    // efail, *, *, *, *
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(errA);
      });
      const parserB = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parserC = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parserD = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parserE = new StrictParser(_ => assert.fail("expect function to not be called"));
      const parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(errA));
    }
  });
});

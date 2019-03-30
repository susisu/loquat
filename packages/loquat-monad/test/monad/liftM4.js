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

const { liftM4 } = _monad;

describe("liftM4", () => {
  it("should lift a 4-ary function on values to a function on parsers", () => {
    const func = (x, y, z, w) =>
      x.toUpperCase() + y.toLowerCase() + z.toUpperCase() + w.toLowerCase();
    const liftedFunc = liftM4(func);
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
    // csucc, csucc, csucc, csucc
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errD, "AbCd", stateD));
    }
    // csucc, csucc, csucc, cfail
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errD));
    }
    // csucc, csucc, csucc, esucc
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(errC, errD),
        "AbCd",
        stateD
      ));
    }
    // csucc, csucc, csucc, efail
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errC, errD)));
    }
    // csucc, csucc, cfail, *
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
      const parserD = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errC));
    }
    // csucc, csucc, esucc, csucc
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errD, "AbCd", stateD));
    }
    // csucc, csucc, esucc, cfail
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errD));
    }
    // csucc, csucc, esucc, esucc
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(ParseError.merge(errB, errC), errD),
        "AbCd",
        stateD
      ));
    }
    // csucc, csucc, esucc, efail
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        ParseError.merge(ParseError.merge(errB, errC), errD)
      ));
    }
    // csucc, csucc, efail, *
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
      const parserD = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errB, errC)));
    }
    // csucc, cfail, *, *
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.cfail(errB);
      });
      const parserC = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const parserD = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errB));
    }
    // csucc, esucc, csucc, csucc
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errD, "AbCd", stateD));
    }
    // csucc, esucc, csucc, cfail
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errD));
    }
    // csucc, esucc, csucc, esucc
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(errC, errD),
        "AbCd",
        stateD
      ));
    }
    // csucc, esucc, csucc, efail
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errC, errD)));
    }
    // csucc, esucc, cfail, *
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
      const parserD = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errC));
    }
    // csucc, esucc, esucc, csucc
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errD, "AbCd", stateD));
    }
    // csucc, esucc, esucc, cfail
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errD));
    }
    // csucc, esucc, esucc, esucc
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD),
        "AbCd",
        stateD
      ));
    }
    // csucc, esucc, esucc, efail
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD)
      ));
    }
    // csucc, esucc, efail, *
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
      const parserD = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        ParseError.merge(ParseError.merge(errA, errB), errC)
      ));
    }
    // csucc, efail, *, *
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.efail(errB);
      });
      const parserC = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const parserD = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errA, errB)));
    }
    // cfail, *, *, *
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(errA);
      });
      const parserB = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const parserC = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const parserD = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errA));
    }
    // esucc, csucc, csucc, csucc
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errD, "AbCd", stateD));
    }
    // esucc, csucc, csucc, cfail
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errD));
    }
    // esucc, csucc, csucc, esucc
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(errC, errD),
        "AbCd",
        stateD
      ));
    }
    // esucc, csucc, csucc, efail
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errC, errD)));
    }
    // esucc, csucc, cfail, *
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
      const parserD = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errC));
    }
    // esucc, csucc, esucc, csucc
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errD, "AbCd", stateD));
    }
    // esucc, csucc, esucc, cfail
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errD));
    }
    // esucc, csucc, esucc, esucc
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(ParseError.merge(errB, errC), errD),
        "AbCd",
        stateD
      ));
    }
    // esucc, csucc, esucc, efail
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        ParseError.merge(ParseError.merge(errB, errC), errD)
      ));
    }
    // esucc, csucc, efail, *
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
      const parserD = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errB, errC)));
    }
    // esucc, cfail, *, *
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.cfail(errB);
      });
      const parserC = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const parserD = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errB));
    }
    // esucc, esucc, csucc, csucc
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errD, "AbCd", stateD));
    }
    // esucc, esucc, csucc, cfail
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errD));
    }
    // esucc, esucc, csucc, esucc
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(errC, errD),
        "AbCd",
        stateD
      ));
    }
    // esucc, esucc, csucc, efail
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errC, errD)));
    }
    // esucc, esucc, cfail, *
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
      const parserD = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errC));
    }
    // esucc, esucc, esucc, csucc
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errD, "AbCd", stateD));
    }
    // esucc, esucc, esucc, cfail
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errD));
    }
    // esucc, esucc, esucc, esucc
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(
        ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD),
        "AbCd",
        stateD
      )
      );
    }
    // esucc, esucc, esucc, efail
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
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD)
      ));
    }
    // esucc, esucc, efail, *
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
      const parserD = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        ParseError.merge(ParseError.merge(errA, errB), errC)
      ));
    }
    // esucc, efail, *, *
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "a", stateA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateA);
        return Result.efail(errB);
      });
      const parserC = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const parserD = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(ParseError.merge(errA, errB)));
    }
    // efail, *, *, *
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(errA);
      });
      const parserB = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const parserC = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const parserD = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });
      const parser = liftedFunc(parserA, parserB, parserC, parserD);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(errA));
    }
  });
});

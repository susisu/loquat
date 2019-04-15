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

const { between } = $combinators;

describe("between", () => {
  it("should create a parser that parses tokens between open and close symbols", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 1, 1),
      "none"
    );
    // csucc, csucc, csucc
    {
      const stateO = new State(
        new Config(),
        "restO",
        new SourcePos("main", 1, 2),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config(),
        "restP",
        new SourcePos("main", 1, 3),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("main", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateO);
        return Result.csucc(errP, "foo", stateP);
      });

      const stateC = new State(
        new Config(),
        "restC",
        new SourcePos("main", 1, 4),
        "someC"
      );
      const errC = new StrictParseError(
        new SourcePos("main", 1, 4),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateP);
        return Result.csucc(errC, "close", stateC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errC, "foo", stateC));
    }
    // csucc, csucc, cfail
    {
      const stateO = new State(
        new Config(),
        "restO",
        new SourcePos("main", 1, 2),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config(),
        "restP",
        new SourcePos("main", 1, 3),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("main", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateO);
        return Result.csucc(errP, "foo", stateP);
      });

      const errC = new StrictParseError(
        new SourcePos("main", 1, 4),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateP);
        return Result.cfail(errC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errC));
    }
    // csucc, csucc, esucc
    {
      const stateO = new State(
        new Config(),
        "restO",
        new SourcePos("main", 1, 2),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config(),
        "restP",
        new SourcePos("main", 1, 3),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("main", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateO);
        return Result.csucc(errP, "foo", stateP);
      });

      const stateC = new State(
        new Config(),
        "restC",
        new SourcePos("main", 1, 3),
        "someC"
      );
      const errC = new StrictParseError(
        new SourcePos("main", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateP);
        return Result.esucc(errC, "close", stateC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(errP, errC),
        "foo",
        stateC
      ));
    }
    // csucc, csucc, efail
    {
      const stateO = new State(
        new Config(),
        "restO",
        new SourcePos("main", 1, 2),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config(),
        "restP",
        new SourcePos("main", 1, 3),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("main", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateO);
        return Result.csucc(errP, "foo", stateP);
      });

      const errC = new StrictParseError(
        new SourcePos("main", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateP);
        return Result.efail(errC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errP, errC)));
    }
    // csucc, cfail, *
    {
      const stateO = new State(
        new Config(),
        "restO",
        new SourcePos("main", 1, 2),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errO, "open", stateO);
      });

      const errP = new StrictParseError(
        new SourcePos("main", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateO);
        return Result.cfail(errP);
      });

      const close = new StrictParser(_ => assert.fail("expect function to not be called"));

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errP));
    }
    // csucc, esucc, csucc
    {
      const stateO = new State(
        new Config(),
        "restO",
        new SourcePos("main", 1, 2),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config(),
        "restP",
        new SourcePos("main", 1, 2),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateO);
        return Result.esucc(errP, "foo", stateP);
      });

      const stateC = new State(
        new Config(),
        "restC",
        new SourcePos("main", 1, 3),
        "someC"
      );
      const errC = new StrictParseError(
        new SourcePos("main", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateP);
        return Result.csucc(errC, "close", stateC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errC, "foo", stateC));
    }
    // csucc, esucc, cfail
    {
      const stateO = new State(
        new Config(),
        "restO",
        new SourcePos("main", 1, 2),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config(),
        "restP",
        new SourcePos("main", 1, 2),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateO);
        return Result.esucc(errP, "foo", stateP);
      });

      const errC = new StrictParseError(
        new SourcePos("main", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateP);
        return Result.cfail(errC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errC));
    }
    // csucc, esucc, esucc
    {
      const stateO = new State(
        new Config(),
        "restO",
        new SourcePos("main", 1, 2),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config(),
        "restP",
        new SourcePos("main", 1, 2),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateO);
        return Result.esucc(errP, "foo", stateP);
      });

      const stateC = new State(
        new Config(),
        "restC",
        new SourcePos("main", 1, 2),
        "someC"
      );
      const errC = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateP);
        return Result.esucc(errC, "close", stateC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(
        ParseError.merge(ParseError.merge(errO, errP), errC),
        "foo",
        stateC
      ));
    }
    // csucc, esucc, efail
    {
      const stateO = new State(
        new Config(),
        "restO",
        new SourcePos("main", 1, 2),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config(),
        "restP",
        new SourcePos("main", 1, 2),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateO);
        return Result.esucc(errP, "foo", stateP);
      });

      const errC = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateP);
        return Result.efail(errC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(
        ParseError.merge(ParseError.merge(errO, errP), errC)
      ));
    }
    // csucc, efail, *
    {
      const stateO = new State(
        new Config(),
        "restO",
        new SourcePos("main", 1, 2),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errO, "open", stateO);
      });

      const errP = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateO);
        return Result.efail(errP);
      });

      const close = new StrictParser(_ => assert.fail("expect function to not be called"));

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errO, errP)));
    }
    // cfail, *, *
    {
      const errO = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(errO);
      });

      const p = new StrictParser(_ => assert.fail("expect function to not be called"));

      const close = new StrictParser(_ => assert.fail("expect function to not be called"));

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errO));
    }
    // esucc, csucc, csucc
    {
      const stateO = new State(
        new Config(),
        "restO",
        new SourcePos("main", 1, 1),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config(),
        "restP",
        new SourcePos("main", 1, 2),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateO);
        return Result.csucc(errP, "foo", stateP);
      });

      const stateC = new State(
        new Config(),
        "restC",
        new SourcePos("main", 1, 3),
        "someC"
      );
      const errC = new StrictParseError(
        new SourcePos("main", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateP);
        return Result.csucc(errC, "close", stateC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errC, "foo", stateC));
    }
    // esucc, csucc, cfail
    {
      const stateO = new State(
        new Config(),
        "restO",
        new SourcePos("main", 1, 1),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config(),
        "restP",
        new SourcePos("main", 1, 2),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateO);
        return Result.csucc(errP, "foo", stateP);
      });

      const errC = new StrictParseError(
        new SourcePos("main", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateP);
        return Result.cfail(errC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errC));
    }
    // esucc, csucc, esucc
    {
      const stateO = new State(
        new Config(),
        "restO",
        new SourcePos("main", 1, 1),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config(),
        "restP",
        new SourcePos("main", 1, 2),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateO);
        return Result.csucc(errP, "foo", stateP);
      });

      const stateC = new State(
        new Config(),
        "restC",
        new SourcePos("main", 1, 2),
        "someC"
      );
      const errC = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateP);
        return Result.esucc(errC, "close", stateC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(ParseError.merge(errP, errC), "foo", stateC));
    }
    // esucc, csucc, efail
    {
      const stateO = new State(
        new Config(),
        "restO",
        new SourcePos("main", 1, 1),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config(),
        "restP",
        new SourcePos("main", 1, 2),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateO);
        return Result.csucc(errP, "foo", stateP);
      });

      const errC = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateP);
        return Result.efail(errC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(ParseError.merge(errP, errC)));
    }
    // esucc, cfail, *
    {
      const stateO = new State(
        new Config(),
        "restO",
        new SourcePos("main", 1, 1),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errO, "open", stateO);
      });

      const errP = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateO);
        return Result.cfail(errP);
      });

      const close = new StrictParser(_ => assert.fail("expect function to not be called"));

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errP));
    }
    // esucc, esucc, csucc
    {
      const stateO = new State(
        new Config(),
        "restO",
        new SourcePos("main", 1, 1),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errO, "open", stateO);
      });

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
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateO);
        return Result.esucc(errP, "foo", stateP);
      });

      const stateC = new State(
        new Config(),
        "restC",
        new SourcePos("main", 1, 2),
        "someC"
      );
      const errC = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateP);
        return Result.csucc(errC, "close", stateC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errC, "foo", stateC));
    }
    // esucc, esucc, cfail
    {
      const stateO = new State(
        new Config(),
        "restO",
        new SourcePos("main", 1, 1),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errO, "open", stateO);
      });

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
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateO);
        return Result.esucc(errP, "foo", stateP);
      });

      const errC = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateP);
        return Result.cfail(errC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errC));
    }
    // esucc, esucc, esucc
    {
      const stateO = new State(
        new Config(),
        "restO",
        new SourcePos("main", 1, 1),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errO, "open", stateO);
      });

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
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateO);
        return Result.esucc(errP, "foo", stateP);
      });

      const stateC = new State(
        new Config(),
        "restC",
        new SourcePos("main", 1, 1),
        "someC"
      );
      const errC = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateP);
        return Result.esucc(errC, "close", stateC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(
        ParseError.merge(ParseError.merge(errO, errP), errC),
        "foo",
        stateC
      ));
    }
    // esucc, esucc, efail
    {
      const stateO = new State(
        new Config(),
        "restO",
        new SourcePos("main", 1, 1),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errO, "open", stateO);
      });

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
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateO);
        return Result.esucc(errP, "foo", stateP);
      });

      const errC = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateP);
        return Result.efail(errC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        ParseError.merge(ParseError.merge(errO, errP), errC)
      ));
    }
    // esucc, efail, *
    {
      const stateO = new State(
        new Config(),
        "restO",
        new SourcePos("main", 1, 1),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errO, "open", stateO);
      });

      const errP = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(stateO);
        return Result.efail(errP);
      });

      const close = new StrictParser(_ => assert.fail("expect function to not be called"));

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(ParseError.merge(errO, errP)));
    }
    // efail, *, *
    {
      const errO = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(errO);
      });

      const p = new StrictParser(_ => assert.fail("expect function to not be called"));

      const close = new StrictParser(_ => assert.fail("expect function to not be called"));

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(errO));
    }
  });
});

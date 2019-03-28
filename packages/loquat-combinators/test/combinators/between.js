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

const { between } = _combinators;

describe(".between(open, close, parser)", () => {
  it("should return a parser that parses what `parser' accepts between `open' and `close'", () => {
    const initState = new State(
      new Config({ tabWidth: 8 }),
      "input",
      new SourcePos("foobar", 1, 1),
      "none"
    );
    // csucc, csucc, csucc
    {
      const stateO = new State(
        new Config({ tabWidth: 8 }),
        "restO",
        new SourcePos("foobar", 1, 2),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config({ tabWidth: 8 }),
        "restP",
        new SourcePos("foobar", 1, 3),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("foobar", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(State.equal(state, stateO)).to.be.true;
        return Result.csucc(errP, "nyancat", stateP);
      });

      const stateC = new State(
        new Config({ tabWidth: 8 }),
        "restC",
        new SourcePos("foobar", 1, 4),
        "someC"
      );
      const errC = new StrictParseError(
        new SourcePos("foobar", 1, 4),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(State.equal(state, stateP)).to.be.true;
        return Result.csucc(errC, "close", stateC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errC, "nyancat", stateC)
      )).to.be.true;
    }
    // csucc, csucc, cfail
    {
      const stateO = new State(
        new Config({ tabWidth: 8 }),
        "restO",
        new SourcePos("foobar", 1, 2),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config({ tabWidth: 8 }),
        "restP",
        new SourcePos("foobar", 1, 3),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("foobar", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(State.equal(state, stateO)).to.be.true;
        return Result.csucc(errP, "nyancat", stateP);
      });

      const errC = new StrictParseError(
        new SourcePos("foobar", 1, 4),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(State.equal(state, stateP)).to.be.true;
        return Result.cfail(errC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errC)
      )).to.be.true;
    }
    // csucc, csucc, esucc
    {
      const stateO = new State(
        new Config({ tabWidth: 8 }),
        "restO",
        new SourcePos("foobar", 1, 2),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config({ tabWidth: 8 }),
        "restP",
        new SourcePos("foobar", 1, 3),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("foobar", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(State.equal(state, stateO)).to.be.true;
        return Result.csucc(errP, "nyancat", stateP);
      });

      const stateC = new State(
        new Config({ tabWidth: 8 }),
        "restC",
        new SourcePos("foobar", 1, 3),
        "someC"
      );
      const errC = new StrictParseError(
        new SourcePos("foobar", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(State.equal(state, stateP)).to.be.true;
        return Result.esucc(errC, "close", stateC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(ParseError.merge(errP, errC), "nyancat", stateC)
      )).to.be.true;
    }
    // csucc, csucc, efail
    {
      const stateO = new State(
        new Config({ tabWidth: 8 }),
        "restO",
        new SourcePos("foobar", 1, 2),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config({ tabWidth: 8 }),
        "restP",
        new SourcePos("foobar", 1, 3),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("foobar", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(State.equal(state, stateO)).to.be.true;
        return Result.csucc(errP, "nyancat", stateP);
      });

      const errC = new StrictParseError(
        new SourcePos("foobar", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(State.equal(state, stateP)).to.be.true;
        return Result.efail(errC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(errP, errC))
      )).to.be.true;
    }
    // csucc, cfail, *
    {
      const stateO = new State(
        new Config({ tabWidth: 8 }),
        "restO",
        new SourcePos("foobar", 1, 2),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errO, "open", stateO);
      });

      const errP = new StrictParseError(
        new SourcePos("foobar", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(State.equal(state, stateO)).to.be.true;
        return Result.cfail(errP);
      });

      const close = new StrictParser(() => { throw new Error("unexpected call"); });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errP)
      )).to.be.true;
    }
    // csucc, esucc, csucc
    {
      const stateO = new State(
        new Config({ tabWidth: 8 }),
        "restO",
        new SourcePos("foobar", 1, 2),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config({ tabWidth: 8 }),
        "restP",
        new SourcePos("foobar", 1, 2),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(State.equal(state, stateO)).to.be.true;
        return Result.esucc(errP, "nyancat", stateP);
      });

      const stateC = new State(
        new Config({ tabWidth: 8 }),
        "restC",
        new SourcePos("foobar", 1, 3),
        "someC"
      );
      const errC = new StrictParseError(
        new SourcePos("foobar", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(State.equal(state, stateP)).to.be.true;
        return Result.csucc(errC, "close", stateC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errC, "nyancat", stateC)
      )).to.be.true;
    }
    // csucc, esucc, cfail
    {
      const stateO = new State(
        new Config({ tabWidth: 8 }),
        "restO",
        new SourcePos("foobar", 1, 2),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config({ tabWidth: 8 }),
        "restP",
        new SourcePos("foobar", 1, 2),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(State.equal(state, stateO)).to.be.true;
        return Result.esucc(errP, "nyancat", stateP);
      });

      const errC = new StrictParseError(
        new SourcePos("foobar", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(State.equal(state, stateP)).to.be.true;
        return Result.cfail(errC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errC)
      )).to.be.true;
    }
    // csucc, esucc, esucc
    {
      const stateO = new State(
        new Config({ tabWidth: 8 }),
        "restO",
        new SourcePos("foobar", 1, 2),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config({ tabWidth: 8 }),
        "restP",
        new SourcePos("foobar", 1, 2),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(State.equal(state, stateO)).to.be.true;
        return Result.esucc(errP, "nyancat", stateP);
      });

      const stateC = new State(
        new Config({ tabWidth: 8 }),
        "restC",
        new SourcePos("foobar", 1, 2),
        "someC"
      );
      const errC = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(State.equal(state, stateP)).to.be.true;
        return Result.esucc(errC, "close", stateC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(ParseError.merge(ParseError.merge(errO, errP), errC), "nyancat", stateC)
      )).to.be.true;
    }
    // csucc, esucc, efail
    {
      const stateO = new State(
        new Config({ tabWidth: 8 }),
        "restO",
        new SourcePos("foobar", 1, 2),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config({ tabWidth: 8 }),
        "restP",
        new SourcePos("foobar", 1, 2),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(State.equal(state, stateO)).to.be.true;
        return Result.esucc(errP, "nyancat", stateP);
      });

      const errC = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(State.equal(state, stateP)).to.be.true;
        return Result.efail(errC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(ParseError.merge(errO, errP), errC))
      )).to.be.true;
    }
    // csucc, efail, *
    {
      const stateO = new State(
        new Config({ tabWidth: 8 }),
        "restO",
        new SourcePos("foobar", 1, 2),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(errO, "open", stateO);
      });

      const errP = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(State.equal(state, stateO)).to.be.true;
        return Result.efail(errP);
      });

      const close = new StrictParser(() => { throw new Error("unexpected call"); });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(errO, errP))
      )).to.be.true;
    }
    // cfail, *, *
    {
      const errO = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.cfail(errO);
      });

      const p = new StrictParser(() => { throw new Error("unexpected call"); });

      const close = new StrictParser(() => { throw new Error("unexpected call"); });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errO)
      )).to.be.true;
    }
    // esucc, csucc, csucc
    {
      const stateO = new State(
        new Config({ tabWidth: 8 }),
        "restO",
        new SourcePos("foobar", 1, 1),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("foobar", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config({ tabWidth: 8 }),
        "restP",
        new SourcePos("foobar", 1, 2),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(State.equal(state, stateO)).to.be.true;
        return Result.csucc(errP, "nyancat", stateP);
      });

      const stateC = new State(
        new Config({ tabWidth: 8 }),
        "restC",
        new SourcePos("foobar", 1, 3),
        "someC"
      );
      const errC = new StrictParseError(
        new SourcePos("foobar", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(State.equal(state, stateP)).to.be.true;
        return Result.csucc(errC, "close", stateC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errC, "nyancat", stateC)
      )).to.be.true;
    }
    // esucc, csucc, cfail
    {
      const stateO = new State(
        new Config({ tabWidth: 8 }),
        "restO",
        new SourcePos("foobar", 1, 1),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("foobar", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config({ tabWidth: 8 }),
        "restP",
        new SourcePos("foobar", 1, 2),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(State.equal(state, stateO)).to.be.true;
        return Result.csucc(errP, "nyancat", stateP);
      });

      const errC = new StrictParseError(
        new SourcePos("foobar", 1, 3),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(State.equal(state, stateP)).to.be.true;
        return Result.cfail(errC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errC)
      )).to.be.true;
    }
    // esucc, csucc, esucc
    {
      const stateO = new State(
        new Config({ tabWidth: 8 }),
        "restO",
        new SourcePos("foobar", 1, 1),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("foobar", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config({ tabWidth: 8 }),
        "restP",
        new SourcePos("foobar", 1, 2),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(State.equal(state, stateO)).to.be.true;
        return Result.csucc(errP, "nyancat", stateP);
      });

      const stateC = new State(
        new Config({ tabWidth: 8 }),
        "restC",
        new SourcePos("foobar", 1, 2),
        "someC"
      );
      const errC = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(State.equal(state, stateP)).to.be.true;
        return Result.esucc(errC, "close", stateC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(ParseError.merge(errP, errC), "nyancat", stateC)
      )).to.be.true;
    }
    // esucc, csucc, efail
    {
      const stateO = new State(
        new Config({ tabWidth: 8 }),
        "restO",
        new SourcePos("foobar", 1, 1),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("foobar", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config({ tabWidth: 8 }),
        "restP",
        new SourcePos("foobar", 1, 2),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(State.equal(state, stateO)).to.be.true;
        return Result.csucc(errP, "nyancat", stateP);
      });

      const errC = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(State.equal(state, stateP)).to.be.true;
        return Result.efail(errC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(ParseError.merge(errP, errC))
      )).to.be.true;
    }
    // esucc, cfail, *
    {
      const stateO = new State(
        new Config({ tabWidth: 8 }),
        "restO",
        new SourcePos("foobar", 1, 1),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("foobar", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errO, "open", stateO);
      });

      const errP = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(State.equal(state, stateO)).to.be.true;
        return Result.cfail(errP);
      });

      const close = new StrictParser(() => { throw new Error("unexpected call"); });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errP)
      )).to.be.true;
    }
    // esucc, esucc, csucc
    {
      const stateO = new State(
        new Config({ tabWidth: 8 }),
        "restO",
        new SourcePos("foobar", 1, 1),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("foobar", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config({ tabWidth: 8 }),
        "restP",
        new SourcePos("foobar", 1, 1),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("foobar", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(State.equal(state, stateO)).to.be.true;
        return Result.esucc(errP, "nyancat", stateP);
      });

      const stateC = new State(
        new Config({ tabWidth: 8 }),
        "restC",
        new SourcePos("foobar", 1, 2),
        "someC"
      );
      const errC = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(State.equal(state, stateP)).to.be.true;
        return Result.csucc(errC, "close", stateC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(errC, "nyancat", stateC)
      )).to.be.true;
    }
    // esucc, esucc, cfail
    {
      const stateO = new State(
        new Config({ tabWidth: 8 }),
        "restO",
        new SourcePos("foobar", 1, 1),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("foobar", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config({ tabWidth: 8 }),
        "restP",
        new SourcePos("foobar", 1, 1),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("foobar", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(State.equal(state, stateO)).to.be.true;
        return Result.esucc(errP, "nyancat", stateP);
      });

      const errC = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(State.equal(state, stateP)).to.be.true;
        return Result.cfail(errC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(errC)
      )).to.be.true;
    }
    // esucc, esucc, esucc
    {
      const stateO = new State(
        new Config({ tabWidth: 8 }),
        "restO",
        new SourcePos("foobar", 1, 1),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("foobar", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config({ tabWidth: 8 }),
        "restP",
        new SourcePos("foobar", 1, 1),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("foobar", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(State.equal(state, stateO)).to.be.true;
        return Result.esucc(errP, "nyancat", stateP);
      });

      const stateC = new State(
        new Config({ tabWidth: 8 }),
        "restC",
        new SourcePos("foobar", 1, 1),
        "someC"
      );
      const errC = new StrictParseError(
        new SourcePos("foobar", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(State.equal(state, stateP)).to.be.true;
        return Result.esucc(errC, "close", stateC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(ParseError.merge(ParseError.merge(errO, errP), errC), "nyancat", stateC)
      )).to.be.true;
    }
    // esucc, esucc, efail
    {
      const stateO = new State(
        new Config({ tabWidth: 8 }),
        "restO",
        new SourcePos("foobar", 1, 1),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("foobar", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errO, "open", stateO);
      });

      const stateP = new State(
        new Config({ tabWidth: 8 }),
        "restP",
        new SourcePos("foobar", 1, 1),
        "someP"
      );
      const errP = new StrictParseError(
        new SourcePos("foobar", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(State.equal(state, stateO)).to.be.true;
        return Result.esucc(errP, "nyancat", stateP);
      });

      const errC = new StrictParseError(
        new SourcePos("foobar", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testC")]
      );
      const close = new StrictParser(state => {
        expect(State.equal(state, stateP)).to.be.true;
        return Result.efail(errC);
      });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(ParseError.merge(ParseError.merge(errO, errP), errC))
      )).to.be.true;
    }
    // esucc, efail, *
    {
      const stateO = new State(
        new Config({ tabWidth: 8 }),
        "restO",
        new SourcePos("foobar", 1, 1),
        "someO"
      );
      const errO = new StrictParseError(
        new SourcePos("foobar", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(errO, "open", stateO);
      });

      const errP = new StrictParseError(
        new SourcePos("foobar", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testP")]
      );
      const p = new StrictParser(state => {
        expect(State.equal(state, stateO)).to.be.true;
        return Result.efail(errP);
      });

      const close = new StrictParser(() => { throw new Error("unexpected call"); });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(ParseError.merge(errO, errP))
      )).to.be.true;
    }
    // efail, *, *
    {
      const errO = new StrictParseError(
        new SourcePos("foobar", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testO")]
      );
      const open = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.efail(errO);
      });

      const p = new StrictParser(() => { throw new Error("unexpected call"); });

      const close = new StrictParser(() => { throw new Error("unexpected call"); });

      const parser = between(open, close, p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(errO)
      )).to.be.true;
    }
  });
});

"use strict";

const { expect } = require("chai");

const {
  SourcePos,
  ErrorMessageType,
  ErrorMessage,
  StrictParseError,
  Config,
  State,
  Result,
  StrictParser,
} = _core;

const { liftM } = _monad;

describe(".liftM(func)", () => {
  it("should lift a function `func' to a function from parser to parser", () => {
    const func = x => x.toUpperCase();
    const liftedFunc = liftM(func);
    expect(liftedFunc).is.a("function");

    const initState = new State(
      new Config({ tabWidth: 8 }),
      "input",
      new SourcePos("foobar", 1, 1),
      "none"
    );
    const finalState = new State(
      new Config({ tabWidth: 4 }),
      "rest",
      new SourcePos("foobar", 1, 2),
      "some"
    );
    const err = new StrictParseError(
      new SourcePos("foobar", 1, 2),
      [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
    );

    {
      const p = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(err, "nyancat", finalState);
      });
      const parser = liftedFunc(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(res, Result.csucc(err, "NYANCAT", finalState))).to.be.true;
    }
    {
      const p = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.cfail(err);
      });
      const parser = liftedFunc(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(res, Result.cfail(err))).to.be.true;
    }
    {
      const p = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(err, "nyancat", finalState);
      });
      const parser = liftedFunc(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(res, Result.esucc(err, "NYANCAT", finalState))).to.be.true;
    }
    {
      const p = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.efail(err);
      });
      const parser = liftedFunc(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(res, Result.efail(err))).to.be.true;
    }
  });
});

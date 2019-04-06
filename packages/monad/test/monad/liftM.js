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
} = $core;

const { liftM } = $monad;

describe("liftM", () => {
  it("should lift an unary function on values to a function on parsers", () => {
    const func = x => x.toUpperCase();
    const liftedFunc = liftM(func);
    expect(liftedFunc).is.a("function");

    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    const finalState = new State(
      new Config(),
      "rest",
      new SourcePos("main", 1, 1, 2),
      "some"
    );
    const err = new StrictParseError(
      new SourcePos("main", 1, 1, 2),
      [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
    );

    {
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(err, "foo", finalState);
      });
      const parser = liftedFunc(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(err, "FOO", finalState));
    }
    {
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(err);
      });
      const parser = liftedFunc(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(err));
    }
    {
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(err, "foo", finalState);
      });
      const parser = liftedFunc(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(err, "FOO", finalState));
    }
    {
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(err);
      });
      const parser = liftedFunc(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(err));
    }
  });
});

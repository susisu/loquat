/*
 * loquat-monad test / monad.liftM()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos        = _core.SourcePos;
const ErrorMessageType = _core.ErrorMessageType;
const ErrorMessage     = _core.ErrorMessage;
const ParseError       = _core.ParseError;
const Config           = _core.Config;
const State            = _core.State;
const Result           = _core.Result;
const Parser           = _core.Parser;
const assertParser     = _core.assertParser;

const liftM = _monad.liftM;

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
    const err = new ParseError(
      new SourcePos("foobar", 1, 2),
      [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
    );

    {
      const p = new Parser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csuc(err, "nyancat", finalState);
      });
      const parser = liftedFunc(p);
      assertParser(parser);
      const res = parser.run(initState);
      expect(Result.equal(res, Result.csuc(err, "NYANCAT", finalState))).to.be.true;
    }
    {
      const p = new Parser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.cerr(err);
      });
      const parser = liftedFunc(p);
      assertParser(parser);
      const res = parser.run(initState);
      expect(Result.equal(res, Result.cerr(err))).to.be.true;
    }
    {
      const p = new Parser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esuc(err, "nyancat", finalState);
      });
      const parser = liftedFunc(p);
      assertParser(parser);
      const res = parser.run(initState);
      expect(Result.equal(res, Result.esuc(err, "NYANCAT", finalState))).to.be.true;
    }
    {
      const p = new Parser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.eerr(err);
      });
      const parser = liftedFunc(p);
      assertParser(parser);
      const res = parser.run(initState);
      expect(Result.equal(res, Result.eerr(err))).to.be.true;
    }
  });
});

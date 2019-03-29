/*
 * loquat-monad test / monad.when()
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

const when = _monad.when;

describe(".when(cond, parser)", () => {
  it("should return a parser that runs `parser' only when `cond' is `true'", () => {
    const initState = new State(
      new Config({ tabWidth: 8 }),
      "input",
      new SourcePos("foobar", 1, 1),
      "none"
    );
    // true, csuc
    {
      const finalState = new State(
        new Config({ tabWidth: 8 }),
        "rest",
        new SourcePos("foobar", 1, 2),
        "some"
      );
      const err = new ParseError(
        new SourcePos("foobar", 1, 2),
        [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new Parser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csuc(err, "nyancat", finalState);
      });

      const condParser = when(true, parser);
      assertParser(condParser);
      const res = condParser.run(initState);
      expect(Result.equal(
        res,
        Result.csuc(err, "nyancat", finalState)
      )).to.be.true;
    }
    // true, cerr
    {
      const err = new ParseError(
        new SourcePos("foobar", 1, 2),
        [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new Parser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.cerr(err);
      });

      const condParser = when(true, parser);
      assertParser(condParser);
      const res = condParser.run(initState);
      expect(Result.equal(
        res,
        Result.cerr(err)
      )).to.be.true;
    }
    // true, esuc
    {
      const finalState = new State(
        new Config({ tabWidth: 8 }),
        "rest",
        new SourcePos("foobar", 1, 1),
        "some"
      );
      const err = new ParseError(
        new SourcePos("foobar", 1, 1),
        [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new Parser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esuc(err, "nyancat", finalState);
      });

      const condParser = when(true, parser);
      assertParser(condParser);
      const res = condParser.run(initState);
      expect(Result.equal(
        res,
        Result.esuc(err, "nyancat", finalState)
      )).to.be.true;
    }
    // true, eerr
    {
      const err = new ParseError(
        new SourcePos("foobar", 1, 1),
        [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new Parser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.eerr(err);
      });

      const condParser = when(true, parser);
      assertParser(condParser);
      const res = condParser.run(initState);
      expect(Result.equal(
        res,
        Result.eerr(err)
      )).to.be.true;
    }
    // false
    {
      const parser = new Parser(() => { throw new Error("unexpected call"); });

      const condParser = when(false, parser);
      assertParser(condParser);
      const res = condParser.run(initState);
      expect(Result.equal(
        res,
        Result.esuc(ParseError.unknown(initState.pos), undefined, initState)
      )).to.be.true;
    }
  });
});

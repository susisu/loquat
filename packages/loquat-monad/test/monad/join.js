/*
 * loquat-monad test / monad.join()
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

const join = _monad.join;

describe(".join(parser)", () => {
  it("should return a parser that runs `parser' and runs the resultant value as a parser", () => {
    const initState = new State(
      new Config({ tabWidth: 8 }),
      "input",
      new SourcePos("foobar", 1, 1),
      "none"
    );
    // csuc, csuc
    {
      const stateA = new State(
        new Config({ tabWidth: 8 }),
        "restA",
        new SourcePos("foobar", 1, 2),
        "someA"
      );
      const errA = new ParseError(
        new SourcePos("foobar", 1, 2),
        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
      );
      const stateB = new State(
        new Config({ tabWidth: 8 }),
        "restB",
        new SourcePos("foobar", 1, 3),
        "someB"
      );
      const errB = new ParseError(
        new SourcePos("foobar", 1, 3),
        [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new Parser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csuc(errB, "nyancat", stateB);
      });
      const parserA = new Parser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csuc(errA, parserB, stateA);
      });

      const parser = join(parserA);
      assertParser(parser);
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csuc(errB, "nyancat", stateB)
      )).to.be.true;
    }
    // csuc, cerr
    {
      const stateA = new State(
        new Config({ tabWidth: 8 }),
        "restA",
        new SourcePos("foobar", 1, 2),
        "someA"
      );
      const errA = new ParseError(
        new SourcePos("foobar", 1, 2),
        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
      );
      const errB = new ParseError(
        new SourcePos("foobar", 1, 3),
        [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new Parser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.cerr(errB);
      });
      const parserA = new Parser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csuc(errA, parserB, stateA);
      });

      const parser = join(parserA);
      assertParser(parser);
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cerr(errB)
      )).to.be.true;
    }
    // csuc, esuc
    {
      const stateA = new State(
        new Config({ tabWidth: 8 }),
        "restA",
        new SourcePos("foobar", 1, 2),
        "someA"
      );
      const errA = new ParseError(
        new SourcePos("foobar", 1, 2),
        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
      );
      const stateB = new State(
        new Config({ tabWidth: 8 }),
        "restB",
        new SourcePos("foobar", 1, 2),
        "someB"
      );
      const errB = new ParseError(
        new SourcePos("foobar", 1, 2),
        [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new Parser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esuc(errB, "nyancat", stateB);
      });
      const parserA = new Parser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csuc(errA, parserB, stateA);
      });

      const parser = join(parserA);
      assertParser(parser);
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csuc(ParseError.merge(errA, errB), "nyancat", stateB)
      )).to.be.true;
    }
    // csuc, eerr
    {
      const stateA = new State(
        new Config({ tabWidth: 8 }),
        "restA",
        new SourcePos("foobar", 1, 2),
        "someA"
      );
      const errA = new ParseError(
        new SourcePos("foobar", 1, 2),
        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
      );
      const errB = new ParseError(
        new SourcePos("foobar", 1, 2),
        [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new Parser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.eerr(errB);
      });
      const parserA = new Parser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csuc(errA, parserB, stateA);
      });

      const parser = join(parserA);
      assertParser(parser);
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cerr(ParseError.merge(errA, errB))
      )).to.be.true;
    }
    // cerr
    {
      const errA = new ParseError(
        new SourcePos("foobar", 1, 2),
        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new Parser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.cerr(errA);
      });

      const parser = join(parserA);
      assertParser(parser);
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cerr(errA)
      )).to.be.true;
    }
    // esuc, csuc
    {
      const stateA = new State(
        new Config({ tabWidth: 8 }),
        "restA",
        new SourcePos("foobar", 1, 1),
        "someA"
      );
      const errA = new ParseError(
        new SourcePos("foobar", 1, 1),
        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
      );
      const stateB = new State(
        new Config({ tabWidth: 8 }),
        "restB",
        new SourcePos("foobar", 1, 2),
        "someB"
      );
      const errB = new ParseError(
        new SourcePos("foobar", 1, 2),
        [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new Parser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.csuc(errB, "nyancat", stateB);
      });
      const parserA = new Parser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esuc(errA, parserB, stateA);
      });

      const parser = join(parserA);
      assertParser(parser);
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.csuc(errB, "nyancat", stateB)
      )).to.be.true;
    }
    // esuc, cerr
    {
      const stateA = new State(
        new Config({ tabWidth: 8 }),
        "restA",
        new SourcePos("foobar", 1, 1),
        "someA"
      );
      const errA = new ParseError(
        new SourcePos("foobar", 1, 1),
        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
      );
      const errB = new ParseError(
        new SourcePos("foobar", 1, 2),
        [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new Parser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.cerr(errB);
      });
      const parserA = new Parser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esuc(errA, parserB, stateA);
      });

      const parser = join(parserA);
      assertParser(parser);
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.cerr(errB)
      )).to.be.true;
    }
    // esuc, esuc
    {
      const stateA = new State(
        new Config({ tabWidth: 8 }),
        "restA",
        new SourcePos("foobar", 1, 1),
        "someA"
      );
      const errA = new ParseError(
        new SourcePos("foobar", 1, 1),
        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
      );
      const stateB = new State(
        new Config({ tabWidth: 8 }),
        "restB",
        new SourcePos("foobar", 1, 1),
        "someB"
      );
      const errB = new ParseError(
        new SourcePos("foobar", 1, 1),
        [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new Parser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.esuc(errB, "nyancat", stateB);
      });
      const parserA = new Parser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esuc(errA, parserB, stateA);
      });

      const parser = join(parserA);
      assertParser(parser);
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.esuc(ParseError.merge(errA, errB), "nyancat", stateB)
      )).to.be.true;
    }
    // esuc, eerr
    {
      const stateA = new State(
        new Config({ tabWidth: 8 }),
        "restA",
        new SourcePos("foobar", 1, 1),
        "someA"
      );
      const errA = new ParseError(
        new SourcePos("foobar", 1, 1),
        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
      );
      const errB = new ParseError(
        new SourcePos("foobar", 1, 1),
        [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
      );
      const parserB = new Parser(state => {
        expect(State.equal(state, stateA)).to.be.true;
        return Result.eerr(errB);
      });
      const parserA = new Parser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esuc(errA, parserB, stateA);
      });

      const parser = join(parserA);
      assertParser(parser);
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.eerr(ParseError.merge(errA, errB))
      )).to.be.true;
    }
    // eerr
    {
      const errA = new ParseError(
        new SourcePos("foobar", 1, 1),
        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
      );
      const parserA = new Parser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.eerr(errA);
      });

      const parser = join(parserA);
      assertParser(parser);
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.eerr(errA)
      )).to.be.true;
    }
  });
});

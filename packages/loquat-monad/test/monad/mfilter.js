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

const { mfilter } = _monad;

describe(".mfilter(test, parser)", () => {
  it("returns a parser that runs `parser' and calls `test' with its resultant value,"
        + " then only succeeds when `test' returns `true'", () => {
    const initState = new State(
      new Config({ tabWidth: 8 }),
      "input",
      new SourcePos("foobar", 1, 1),
      "none"
    );
    // csucc
    {
      const finalState = new State(
        new Config({ tabWidth: 8 }),
        "rest",
        new SourcePos("foobar", 1, 2),
        "some"
      );
      const err = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(err, "nyancat", finalState);
      });
            // true
      {
        const test = val => {
          expect(val).to.equal("nyancat");
          return true;
        };
        const filtered = mfilter(test, parser);
        expect(filtered).to.be.a.parser;
        const res = filtered.run(initState);
        expect(Result.equal(
          res,
          Result.csucc(err, "nyancat", finalState)
        )).to.be.true;
      }
      // false
      {
        const test = val => {
          expect(val).to.equal("nyancat");
          return false;
        };
        const filtered = mfilter(test, parser);
        expect(filtered).to.be.a.parser;
        const res = filtered.run(initState);
        expect(Result.equal(
          res,
          Result.cfail(err)
        )).to.be.true;
      }
    }
    // cfail
    {
      const err = new StrictParseError(
        new SourcePos("foobar", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.cfail(err);
      });
      const test = () => { throw new Error("unexpected call"); };
      const filtered = mfilter(test, parser);
      expect(filtered).to.be.a.parser;
      const res = filtered.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(err)
      )).to.be.true;
    }
    // esucc
    {
      const finalState = new State(
        new Config({ tabWidth: 8 }),
        "rest",
        new SourcePos("foobar", 1, 1),
        "some"
      );
      const err = new StrictParseError(
        new SourcePos("foobar", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(err, "nyancat", finalState);
      });
            // true
      {
        const test = val => {
          expect(val).to.equal("nyancat");
          return true;
        };
        const filtered = mfilter(test, parser);
        expect(filtered).to.be.a.parser;
        const res = filtered.run(initState);
        expect(Result.equal(
          res,
          Result.esucc(err, "nyancat", finalState)
        )).to.be.true;
      }
      // false
      {
        const test = val => {
          expect(val).to.equal("nyancat");
          return false;
        };
        const filtered = mfilter(test, parser);
        expect(filtered).to.be.a.parser;
        const res = filtered.run(initState);
        expect(Result.equal(
          res,
          Result.efail(err)
        )).to.be.true;
      }
    }
    // efail
    {
      const err = new StrictParseError(
        new SourcePos("foobar", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.efail(err);
      });
      const test = () => { throw new Error("unexpected call"); };
      const filtered = mfilter(test, parser);
      expect(filtered).to.be.a.parser;
      const res = filtered.run(initState);
      expect(Result.equal(
        res,
        Result.efail(err)
      )).to.be.true;
    }
  });
});

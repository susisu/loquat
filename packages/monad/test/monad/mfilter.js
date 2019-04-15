"use strict";

const { expect, assert } = require("chai");

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

const { mfilter } = $monad;

describe("mfilter", () => {
  it("should create a parser that runs the given parser and tests the result with a function, and"
    + " only succeds when it passed", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 1, 1),
      "none"
    );
    // csucc
    {
      const finalState = new State(
        new Config(),
        "rest",
        new SourcePos("main", 1, 2),
        "some"
      );
      const err = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(err, "foo", finalState);
      });
      // true
      {
        const test = val => {
          expect(val).to.equal("foo");
          return true;
        };
        const filtered = mfilter(test, parser);
        expect(filtered).to.be.a.parser;
        const res = filtered.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(err, "foo", finalState));
      }
      // false
      {
        const test = val => {
          expect(val).to.equal("foo");
          return false;
        };
        const filtered = mfilter(test, parser);
        expect(filtered).to.be.a.parser;
        const res = filtered.run(initState);
        expect(res).to.be.an.equalResultTo(Result.cfail(err));
      }
    }
    // cfail
    {
      const err = new StrictParseError(
        new SourcePos("main", 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(err);
      });
      const test = _ => assert.fail("expect function to not be called");
      const filtered = mfilter(test, parser);
      expect(filtered).to.be.a.parser;
      const res = filtered.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(err));
    }
    // esucc
    {
      const finalState = new State(
        new Config(),
        "rest",
        new SourcePos("main", 1, 1),
        "some"
      );
      const err = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(err, "foo", finalState);
      });
      // true
      {
        const test = val => {
          expect(val).to.equal("foo");
          return true;
        };
        const filtered = mfilter(test, parser);
        expect(filtered).to.be.a.parser;
        const res = filtered.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(err, "foo", finalState));
      }
      // false
      {
        const test = val => {
          expect(val).to.equal("foo");
          return false;
        };
        const filtered = mfilter(test, parser);
        expect(filtered).to.be.a.parser;
        const res = filtered.run(initState);
        expect(res).to.be.an.equalResultTo(Result.efail(err));
      }
    }
    // efail
    {
      const err = new StrictParseError(
        new SourcePos("main", 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(err);
      });
      const test = _ => assert.fail("expect function to not be called");
      const filtered = mfilter(test, parser);
      expect(filtered).to.be.a.parser;
      const res = filtered.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(err));
    }
  });
});

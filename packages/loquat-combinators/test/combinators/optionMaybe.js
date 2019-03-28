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

const { optionMaybe } = _combinators;

describe(".optionMaybe(parser)", () => {
  it("should return a parser that attempts to parse by `parser',"
        + " and returns some result unless it empty fails, or returns empty", () => {
    const objEqual = (objA, objB) => {
      const keysA = Object.keys(objA);
      const keysB = Object.keys(objB);
      return keysA.length === keysB.length
                && keysA.every(key => objA[key] === objB[key]);
    };
    const initState = new State(
      new Config({ tabWidth: 8 }),
      "input",
      new SourcePos("foobar", 1, 1),
      "none"
    );
    const finalState = new State(
      new Config({ tabWidth: 4 }),
      "rest",
      new SourcePos("foobar", 496, 28),
      "some"
    );
    const err = new StrictParseError(
      new SourcePos("foobar", 496, 28),
      [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
    );
    // csucc
    {
      const parser = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(err, "nyancat", finalState);
      });
      const optParser = optionMaybe(parser);
      expect(optParser).to.be.a.parser;
      const res = optParser.run(initState);
      expect(Result.equal(
        res,
        Result.csucc(err, { empty: false, value: "nyancat" }, finalState),
        objEqual
      )).to.be.true;
    }
    // cfail
    {
      const parser = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.cfail(err);
      });
      const optParser = optionMaybe(parser);
      expect(optParser).to.be.a.parser;
      const res = optParser.run(initState);
      expect(Result.equal(
        res,
        Result.cfail(err),
        objEqual
      )).to.be.true;
    }
    // esucc
    {
      const parser = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(err, "nyancat", finalState);
      });
      const optParser = optionMaybe(parser);
      expect(optParser).to.be.a.parser;
      const res = optParser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(err, { empty: false, value: "nyancat" }, finalState),
        objEqual
      )).to.be.true;
    }
    // efail
    {
      const parser = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.efail(err);
      });
      const optParser = optionMaybe(parser);
      expect(optParser).to.be.a.parser;
      const res = optParser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(err, { empty: true }, initState),
        objEqual
      )).to.be.true;
    }
  });
});

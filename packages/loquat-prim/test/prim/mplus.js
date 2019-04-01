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
} = _core;

const { mzero, mplus } = _prim;

describe("mplus", () => {
  it("should create a parser that runs one parser and if it fails without consumption, runs the"
    + " other parser", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    const stateA = new State(
      new Config(),
      "restA",
      new SourcePos("main", 1, 1, 2),
      "someA"
    );
    const errA = new StrictParseError(
      new SourcePos("main", 1, 1, 2),
      [ErrorMessage.create(ErrorMessageType.MESSAGE, "testA")]
    );
    const stateB = new State(
      new Config({ tabWidth: 2 }),
      "restB",
      new SourcePos("main", 1, 1, 2),
      "someB"
    );
    const errB = new StrictParseError(
      new SourcePos("main", 1, 1, 2),
      [ErrorMessage.create(ErrorMessageType.MESSAGE, "testB")]
    );
    // csucc
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errA, "foo", stateA);
      });
      const parserB = new StrictParser(_ => assert.fail("expect function to not be called"));
      const composed = mplus(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errA, "foo", stateA));
    }
    // cfail
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(errA);
      });
      const parserB = new StrictParser(_ => assert.fail("expect function to not be called"));
      const composed = mplus(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errA));
    }
    // esucc
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errA, "foo", stateA);
      });
      const parserB = new StrictParser(_ => assert.fail("expect function to not be called"));
      const composed = mplus(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(errA, "foo", stateA));
    }
    // efail, csucc
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(errA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(errB, "bar", stateB);
      });
      const composed = mplus(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(errB, "bar", stateB));
    }
    // efail, cfail
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(errA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(errB);
      });
      const composed = mplus(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(errB));
    }
    // efail, esucc
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(errA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(errB, "bar", stateB);
      });
      const composed = mplus(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(ParseError.merge(errA, errB), "bar", stateB));
    }
    // efail, efail
    {
      const parserA = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(errA);
      });
      const parserB = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(errB);
      });
      const composed = mplus(parserA, parserB);
      expect(composed).to.be.a.parser;
      const res = composed.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(ParseError.merge(errA, errB)));
    }
  });

  it("should satisfy the monoid laws", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    // (u `mplus` v) `mplus` w = u `mplus` (v `mplus` w)
    {
      const stateU = new State(
        new Config(),
        "restU",
        new SourcePos("main", 1, 1, 2),
        "someU"
      );
      const errU = new StrictParseError(
        new SourcePos("main", 1, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testU")]
      );
      const us = [
        new StrictParser(() => Result.csucc(errU, "u", stateU)),
        new StrictParser(() => Result.cfail(errU)),
        new StrictParser(() => Result.esucc(errU, "u", stateU)),
        new StrictParser(() => Result.efail(errU)),
      ];

      const stateV = new State(
        new Config(),
        "restV",
        new SourcePos("main", 1, 1, 2),
        "someV"
      );
      const errV = new StrictParseError(
        new SourcePos("main", 1, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testV")]
      );
      const vs = [
        new StrictParser(() => Result.csucc(errV, "v", stateV)),
        new StrictParser(() => Result.cfail(errV)),
        new StrictParser(() => Result.esucc(errV, "v", stateV)),
        new StrictParser(() => Result.efail(errV)),
      ];

      const stateW = new State(
        new Config(),
        "restW",
        new SourcePos("main", 1, 1, 2),
        "someW"
      );
      const errW = new StrictParseError(
        new SourcePos("main", 1, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "testW")]
      );
      const ws = [
        new StrictParser(() => Result.csucc(errW, "w", stateW)),
        new StrictParser(() => Result.cfail(errW)),
        new StrictParser(() => Result.esucc(errW, "w", stateW)),
        new StrictParser(() => Result.efail(errW)),
      ];

      for (const u of us) {
        for (const v of vs) {
          for (const w of ws) {
            const lhs = mplus(mplus(u, v), w).run(initState);
            const rhs = mplus(u, mplus(v, w)).run(initState);
            expect(lhs).to.be.an.equalResultTo(rhs);
          }
        }
      }
    }
    // parser `mplus` mzero = mzero `mplus` parser = parser
    {
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
      const parsers = [
        new StrictParser(() => Result.csucc(err, "nyancat", finalState)),
        new StrictParser(() => Result.cfail(err)),
        new StrictParser(() => Result.esucc(err, "nyancat", finalState)),
        new StrictParser(() => Result.efail(err)),
      ];
      for (const parser of parsers) {
        const rhs = parser.run(initState);
        {
          const lhs = mplus(parser, mzero).run(initState);
          expect(lhs).to.be.an.equalResultTo(rhs);
        }
        {
          const lhs = mplus(mzero, parser).run(initState);
          expect(lhs).to.be.an.equalResultTo(rhs);
        }
      }
    }
  });
});

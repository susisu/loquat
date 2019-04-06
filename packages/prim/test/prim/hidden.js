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
} = $core;

const { hidden } = $prim;

describe("hidden", () => {
  it("should create a parser labelled with an empty string", () => {
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
    // unknown error case
    {
      const err = ParseError.unknown(new SourcePos("main", 1, 1, 2));
      // csucc
      {
        const parser = new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.csucc(err, "foo", finalState);
        });
        const labelled = hidden(parser);
        expect(labelled).to.be.a.parser;
        const res = labelled.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(err, "foo", finalState));
      }
      // cfail
      {
        const parser = new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.cfail(err);
        });
        const labelled = hidden(parser);
        expect(labelled).to.be.a.parser;
        const res = labelled.run(initState);
        expect(res).to.be.an.equalResultTo(Result.cfail(err));
      }
      // esucc
      {
        const parser = new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.esucc(err, "foo", finalState);
        });
        const labelled = hidden(parser);
        expect(labelled).to.be.a.parser;
        const res = labelled.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(err, "foo", finalState));
      }
      // efail
      {
        const parser = new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.efail(err);
        });
        const labelled = hidden(parser);
        expect(labelled).to.be.a.parser;
        const res = labelled.run(initState);
        expect(res).to.be.an.equalResultTo(Result.efail(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [ErrorMessage.create(ErrorMessageType.EXPECT, "")]
          )
        ));
      }
    }
    // known error case
    {
      const err = new StrictParseError(
        new SourcePos("main", 1, 1, 2),
        [
          ErrorMessage.create(ErrorMessageType.EXPECT, "expect1"),
          ErrorMessage.create(ErrorMessageType.MESSAGE, "test"),
          ErrorMessage.create(ErrorMessageType.EXPECT, "expect2"),
        ]
      );
      // csucc
      {
        const parser = new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.csucc(err, "foo", finalState);
        });
        const labelled = hidden(parser);
        expect(labelled).to.be.a.parser;
        const res = labelled.run(initState);
        expect(res).to.be.an.equalResultTo(Result.csucc(err, "foo", finalState));
      }
      // cfail
      {
        const parser = new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.cfail(err);
        });
        const labelled = hidden(parser);
        expect(labelled).to.be.a.parser;
        const res = labelled.run(initState);
        expect(res).to.be.an.equalResultTo(Result.cfail(err));
      }
      // esucc
      {
        const parser = new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.esucc(err, "foo", finalState);
        });
        const labelled = hidden(parser);
        expect(labelled).to.be.a.parser;
        const res = labelled.run(initState);
        expect(res).to.be.an.equalResultTo(Result.esucc(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "test"),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          ),
          "foo",
          finalState
        ));
      }
      // efail
      {
        const parser = new StrictParser(state => {
          expect(state).to.be.an.equalStateTo(initState);
          return Result.efail(err);
        });
        const labelled = hidden(parser);
        expect(labelled).to.be.a.parser;
        const res = labelled.run(initState);
        expect(res).to.be.an.equalResultTo(Result.efail(
          new StrictParseError(
            new SourcePos("main", 1, 1, 2),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "test"),
              ErrorMessage.create(ErrorMessageType.EXPECT, ""),
            ]
          )
        ));
      }
    }
  });
});

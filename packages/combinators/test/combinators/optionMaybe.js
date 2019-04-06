"use strict";

const chai = require("chai");
const { expect } = chai;

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

const { optionMaybe } = $combinators;

describe("optionMaybe", () => {
  it("should create a parser that tries the given parser and returns its result wrapped by an"
    + " object if it succeeds, or returns an empty result if it fails without consumption", () => {
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
    // csucc
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(state);
        return Result.csucc(err, "foo", finalState);
      });
      const optParser = optionMaybe(parser);
      expect(optParser).to.be.a.parser;
      const res = optParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.csucc(err, { empty: false, value: "foo" }, finalState),
        chai.util.eql
      );
    }
    // cfail
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(state);
        return Result.cfail(err);
      });
      const optParser = optionMaybe(parser);
      expect(optParser).to.be.a.parser;
      const res = optParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(err));
    }
    // esucc
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(state);
        return Result.esucc(err, "foo", finalState);
      });
      const optParser = optionMaybe(parser);
      expect(optParser).to.be.a.parser;
      const res = optParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.esucc(err, { empty: false, value: "foo" }, finalState),
        chai.util.eql
      );
    }
    // efail
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(state);
        return Result.efail(err);
      });
      const optParser = optionMaybe(parser);
      expect(optParser).to.be.a.parser;
      const res = optParser.run(initState);
      expect(res).to.be.an.equalResultTo(
        Result.esucc(err, { empty: true }, initState),
        chai.util.eql
      );
    }
  });
});

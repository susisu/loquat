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

const { option } = $combinators;

describe("option", () => {
  it("should create a parser that tries the given parser and returns its result if it succeeds, or"
    + " returns the given alternative value if it fails without consumption", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 1, 1),
      "none"
    );
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
    // csucc
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(err, "foo", finalState);
      });
      const optParser = option("bar", parser);
      expect(optParser).to.be.a.parser;
      const res = optParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(err, "foo", finalState));
    }
    // cfail
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(err);
      });
      const optParser = option("bar", parser);
      expect(optParser).to.be.a.parser;
      const res = optParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(err));
    }
    // esucc
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(err, "foo", finalState);
      });
      const optParser = option("bar", parser);
      expect(optParser).to.be.a.parser;
      const res = optParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(err, "foo", finalState));
    }
    // efail
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(err);
      });
      const optParser = option("bar", parser);
      expect(optParser).to.be.a.parser;
      const res = optParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(err, "bar", initState));
    }
  });
});

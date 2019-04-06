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

const { optional } = $combinators;

describe("optional", () => {
  it("should create a parser that tries the given parser and ignores its failure if there is no"
    + " consumption", () => {
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
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(err, "foo", finalState);
      });
      const optParser = optional(parser);
      expect(optParser).to.be.a.parser;
      const res = optParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(err, undefined, finalState));
    }
    // cfail
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(err);
      });
      const optParser = optional(parser);
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
      const optParser = optional(parser);
      expect(optParser).to.be.a.parser;
      const res = optParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(err, undefined, finalState));
    }
    // efail
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(err);
      });
      const optParser = optional(parser);
      expect(optParser).to.be.a.parser;
      const res = optParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(err, undefined, initState));
    }
  });
});

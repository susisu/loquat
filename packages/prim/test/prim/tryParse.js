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

const { tryParse } = $prim;

describe("tryParse", () => {
  it("should create a parser that transforms failure with consumption of the original parser to"
    + " failure without consumption", () => {
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
      const tryParser = tryParse(parser);
      expect(tryParser).to.be.a.parser;
      const res = tryParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(err, "foo", finalState));
    }
    // cfail
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(err);
      });
      const tryParser = tryParse(parser);
      expect(tryParser).to.be.a.parser;
      const res = tryParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(err));
    }
    // esucc
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(err, "foo", finalState);
      });
      const tryParser = tryParse(parser);
      expect(tryParser).to.be.a.parser;
      const res = tryParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(err, "foo", finalState));
    }
    // efail
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(err);
      });
      const tryParser = tryParse(parser);
      expect(tryParser).to.be.a.parser;
      const res = tryParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(err));
    }
  });
});

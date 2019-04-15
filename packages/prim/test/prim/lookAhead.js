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

const { lookAhead } = $prim;

describe("lookAhead", () => {
  it("should create a parser that runs the given parser and returns the original state when it"
    + " succeeds", () => {
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
      const aheadParser = lookAhead(parser);
      expect(aheadParser).to.be.a.parser;
      const res = aheadParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(
        ParseError.unknown(new SourcePos("main", 1, 1)),
        "foo",
        initState
      ));
    }
    // cfail
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(err);
      });
      const aheadParser = lookAhead(parser);
      expect(aheadParser).to.be.a.parser;
      const res = aheadParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(err));
    }
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(err, "foo", finalState);
      });
      const aheadParser = lookAhead(parser);
      expect(aheadParser).to.be.a.parser;
      const res = aheadParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(
        ParseError.unknown(new SourcePos("main", 1, 1)),
        "foo",
        initState
      ));
    }
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(err);
      });
      const aheadParser = lookAhead(parser);
      expect(aheadParser).to.be.a.parser;
      const res = aheadParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(err));
    }
  });
});

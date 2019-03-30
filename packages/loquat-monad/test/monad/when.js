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

const { when } = _monad;

describe("when", () => {
  it("should create a parser that runs the given parser only when the given condition is"
    + " satisfied", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    // true, csucc
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
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(err, "foo", finalState);
      });

      const condParser = when(true, parser);
      expect(condParser).to.be.a.parser;
      const res = condParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(err, "foo", finalState));
    }
    // true, cfail
    {
      const err = new StrictParseError(
        new SourcePos("main", 1, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(err);
      });

      const condParser = when(true, parser);
      expect(condParser).to.be.a.parser;
      const res = condParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(err));
    }
    // true, esucc
    {
      const finalState = new State(
        new Config(),
        "rest",
        new SourcePos("main", 0, 1, 1),
        "some"
      );
      const err = new StrictParseError(
        new SourcePos("main", 0, 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(err, "foo", finalState);
      });

      const condParser = when(true, parser);
      expect(condParser).to.be.a.parser;
      const res = condParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(err, "foo", finalState));
    }
    // true, efail
    {
      const err = new StrictParseError(
        new SourcePos("main", 0, 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(err);
      });

      const condParser = when(true, parser);
      expect(condParser).to.be.a.parser;
      const res = condParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(err));
    }
    // false
    {
      const parser = new StrictParser(state => {
        assert.fail("expect function to not be called");
      });

      const condParser = when(false, parser);
      expect(condParser).to.be.a.parser;
      const res = condParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(
        ParseError.unknown(initState.pos),
        undefined,
        initState
      ));
    }
  });
});

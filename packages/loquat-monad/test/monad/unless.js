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

const { unless } = _monad;

describe("unless", () => {
  it("should create a parser that runs the given parser only when the given condition is not"
    + " satisfied", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    // false, csucc
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
        return Result.csucc(err, "nyancat", finalState);
      });

      const condParser = unless(false, parser);
      expect(condParser).to.be.a.parser;
      const res = condParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(err, "nyancat", finalState));
    }
    // false, cfail
    {
      const err = new StrictParseError(
        new SourcePos("main", 1, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(err);
      });

      const condParser = unless(false, parser);
      expect(condParser).to.be.a.parser;
      const res = condParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(err));
    }
    // false, esucc
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
        return Result.esucc(err, "nyancat", finalState);
      });

      const condParser = unless(false, parser);
      expect(condParser).to.be.a.parser;
      const res = condParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(err, "nyancat", finalState));
    }
    // false, efail
    {
      const err = new StrictParseError(
        new SourcePos("main", 0, 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(err);
      });

      const condParser = unless(false, parser);
      expect(condParser).to.be.a.parser;
      const res = condParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(err));
    }
    // true
    {
      const parser = new StrictParser(state => assert.fail("expect function to not be called"));

      const condParser = unless(true, parser);
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

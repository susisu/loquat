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

const { discard } = _monad;

describe("discard", () => {
  it("should create a parser that discards the return value of the given parser", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
    // csucc
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
      const voidParser = discard(parser);
      expect(voidParser).to.be.a.parser;
      const res = voidParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(err, undefined, finalState));
    }
    // cfail
    {
      const err = new StrictParseError(
        new SourcePos("main", 1, 1, 2),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(err);
      });
      const voidParser = discard(parser);
      expect(voidParser).to.be.a.parser;
      const res = voidParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(err));
    }
    // esucc
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
      const voidParser = discard(parser);
      expect(voidParser).to.be.a.parser;
      const res = voidParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(err, undefined, finalState));
    }
    // efail
    {
      const err = new StrictParseError(
        new SourcePos("main", 0, 1, 1),
        [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
      );
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(err);
      });
      const voidParser = discard(parser);
      expect(voidParser).to.be.a.parser;
      const res = voidParser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(err));
    }
  });
});

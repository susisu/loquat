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

const { map } = $prim;

describe("map", () => {
  it("should create a parser that runs a parser and applies a function to its result", () => {
    const func = x => x.toUpperCase();

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

    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(err, "foo", finalState);
      });
      const mapped = map(parser, func);
      expect(mapped).to.be.a.parser;
      const res = mapped.run(initState);
      expect(res).to.be.an.equalResultTo(Result.csucc(err, "FOO", finalState));
    }
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(err);
      });
      const mapped = map(parser, func);
      expect(mapped).to.be.a.parser;
      const res = mapped.run(initState);
      expect(res).to.be.an.equalResultTo(Result.cfail(err));
    }
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(err, "foo", finalState);
      });
      const mapped = map(parser, func);
      expect(mapped).to.be.a.parser;
      const res = mapped.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(err, "FOO", finalState));
    }
    {
      const parser = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(err);
      });
      const mapped = map(parser, func);
      expect(mapped).to.be.a.parser;
      const res = mapped.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(err));
    }
  });
});

"use strict";

const { expect } = require("chai");

const {
  show,
  SourcePos,
  ErrorMessageType,
  ErrorMessage,
  StrictParseError,
  Config,
  State,
  Result,
  StrictParser,
} = $core;

const { notFollowedBy } = $combinators;

describe("notFollowedBy", () => {
  it("should create a parser that succeeds without consumption only when the given parser"
    + " fails", () => {
    const initState = new State(
      new Config(),
      "input",
      new SourcePos("main", 0, 1, 1),
      "none"
    );
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
    // csucc
    {
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.csucc(err, "foo", finalState);
      });
      const parser = notFollowedBy(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.MESSAGE, "test"),
            ErrorMessage.create(ErrorMessageType.UNEXPECT, show("foo")),
          ]
        )
      ));
    }
    // cfail
    {
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.cfail(err);
      });
      const parser = notFollowedBy(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
        ),
        undefined,
        initState
      ));
    }
    // esucc
    {
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.esucc(err, "foo", finalState);
      });
      const parser = notFollowedBy(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.efail(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [
            ErrorMessage.create(ErrorMessageType.MESSAGE, "test"),
            ErrorMessage.create(ErrorMessageType.UNEXPECT, show("foo")),
          ]
        )
      ));
    }
    // efail
    {
      const p = new StrictParser(state => {
        expect(state).to.be.an.equalStateTo(initState);
        return Result.efail(err);
      });
      const parser = notFollowedBy(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(res).to.be.an.equalResultTo(Result.esucc(
        new StrictParseError(
          new SourcePos("main", 0, 1, 1),
          [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
        ),
        undefined,
        initState
      ));
    }
  });
});

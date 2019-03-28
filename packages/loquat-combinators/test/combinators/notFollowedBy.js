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
} = _core;

const { notFollowedBy } = _combinators;

describe(".notFollowedBy(parser)", () => {
  it("should return a parser that succeeds without consuming input only when `parser'"
    + " fails", () => {
    const initState = new State(
      new Config({ tabWidth: 8 }),
      "input",
      new SourcePos("foobar", 1, 1),
      "none"
    );
    const finalState = new State(
      new Config({ tabWidth: 4 }),
      "rest",
      new SourcePos("foobar", 1, 1),
      "some"
    );
    const err = new StrictParseError(
      new SourcePos("foobar", 1, 1),
      [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
    );
    // csucc
    {
      const p = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.csucc(err, "nyancat", finalState);
      });
      const parser = notFollowedBy(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "test"),
              ErrorMessage.create(ErrorMessageType.UNEXPECT, show("nyancat")),
            ]
          )
        )
      )).to.be.true;
    }
    // cfail
    {
      const p = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.cfail(err);
      });
      const parser = notFollowedBy(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          ),
          undefined,
          initState
        )
      )).to.be.true;
    }
    // esucc
    {
      const p = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.esucc(err, "nyancat", finalState);
      });
      const parser = notFollowedBy(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.efail(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [
              ErrorMessage.create(ErrorMessageType.MESSAGE, "test"),
              ErrorMessage.create(ErrorMessageType.UNEXPECT, show("nyancat")),
            ]
          )
        )
      )).to.be.true;
    }
    // efail
    {
      const p = new StrictParser(state => {
        expect(State.equal(state, initState)).to.be.true;
        return Result.efail(err);
      });
      const parser = notFollowedBy(p);
      expect(parser).to.be.a.parser;
      const res = parser.run(initState);
      expect(Result.equal(
        res,
        Result.esucc(
          new StrictParseError(
            new SourcePos("foobar", 1, 1),
            [ErrorMessage.create(ErrorMessageType.MESSAGE, "test")]
          ),
          undefined,
          initState
        )
      )).to.be.true;
    }
  });
});

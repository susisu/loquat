"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, ParseError } = _error;
const { Config, State, Result, Parser } = _parser;

describe("#run", () => {
  it("should call the parser function with the given state and return the result", () => {
    let flag = false;
    const parser = new Parser(state => {
      flag = true;
      expect(State.equal(
        state,
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "test",
          new SourcePos("main", 6, 28),
          "none"
        )
      )).to.be.true;
      return new Result(
        true,
        true,
        new ParseError(
          new SourcePos("main", 7, 28),
          [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
          ]
        ),
        "val",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "rest",
          new SourcePos("main", 7, 29),
          "some"
        )
      );
    });
    const res = parser.run(new State(
      new Config({ tabWidth: 4, unicode: true }),
      "test",
      new SourcePos("main", 6, 28),
      "none"
    ));
    expect(flag).to.be.true;
    expect(Result.equal(
      res,
      new Result(
        true,
        true,
        new ParseError(
          new SourcePos("main", 7, 28),
          [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
          ]
        ),
        "val",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "rest",
          new SourcePos("main", 7, 29),
          "some"
        )
      )
    )).to.be.true;
  });
});

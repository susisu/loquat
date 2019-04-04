"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, StrictParseError } = _error;
const { Config, State, Result, StrictParser } = _parser;

describe("#run", () => {
  it("should call the parser function with the given state and return the result", () => {
    let flag = false;
    const parser = new StrictParser(state => {
      flag = true;
      expect(State.equal(state, new State(
        new Config({ tabWidth: 4, unicode: true }),
        "test",
        new SourcePos("main", 496, 6, 28),
        "none"
      ))).to.be.true;
      return Result.csucc(
        new StrictParseError(
          new SourcePos("main", 506, 7, 29),
          [
            ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
            ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
            ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
          ]
        ),
        "val",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "rest",
          new SourcePos("main", 516, 8, 30),
          "some"
        )
      );
    });
    const res = parser.run(new State(
      new Config({ tabWidth: 4, unicode: true }),
      "test",
      new SourcePos("main", 496, 6, 28),
      "none"
    ));
    expect(flag).to.be.true;
    expect(Result.equal(res, Result.csucc(
      new StrictParseError(
        new SourcePos("main", 506, 7, 29),
        [
          ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
          ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
          ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
          ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
        ]
      ),
      "val",
      new State(
        new Config({ tabWidth: 4, unicode: true }),
        "rest",
        new SourcePos("main", 516, 8, 30),
        "some"
      )
    ))).to.be.true;
  });
});

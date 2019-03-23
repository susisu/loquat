"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, StrictParseError } = _error;
const { Config, State, Result, StrictParser, LazyParser } = _parser;

describe("#run(state)", () => {
  it("should evaluate the thunk and run the resultant parser with the given state", () => {
    let flag = false;
    let evaluated = false;
    const parser = new LazyParser(() => {
      evaluated = true;
      return new StrictParser(state => {
        flag = true;
        expect(state).to.be.an.equalStateTo(new State(
          new Config({ tabWidth: 4, unicode: true }),
          "test",
          new SourcePos("main", 496, 6, 28),
          "none"
        ));
        return new Result(
          true,
          true,
          new StrictParseError(
            new SourcePos("main", 506, 7, 29),
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
            new SourcePos("main", 516, 8, 30),
            "some"
          )
        );
      });
    });
    const res = parser.run(new State(
      new Config({ tabWidth: 4, unicode: true }),
      "test",
      new SourcePos("main", 496, 6, 28),
      "none"
    ));
    expect(evaluated).to.be.true;
    expect(flag).to.be.true;
    expect(res).to.be.an.equalResultTo(new Result(
      true,
      true,
      new StrictParseError(
        new SourcePos("main", 506, 7, 29),
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
        new SourcePos("main", 516, 8, 30),
        "some"
      )
    ));
  });
});

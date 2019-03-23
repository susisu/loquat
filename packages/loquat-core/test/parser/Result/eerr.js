"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, ParseError } = _error;
const { Result } = _parser;

describe(".eerr", () => {
  it("should create an empty failure result object", () => {
    const res = Result.eerr(
      new ParseError(
        new SourcePos("main", 6, 28),
        [
          new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
          new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
          new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
          new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
        ]
      )
    );
    expect(res).to.be.an.equalResultTo(new Result(
      false,
      false,
      new ParseError(
        new SourcePos("main", 6, 28),
        [
          new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
          new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
          new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
          new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
        ]
      )
    ));
  });
});

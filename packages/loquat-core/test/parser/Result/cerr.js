"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, StrictParseError } = _error;
const { Result } = _parser;

describe(".cerr", () => {
  it("should create a consumed failure result object", () => {
    const res = Result.cerr(
      new StrictParseError(
        new SourcePos("main", 496, 6, 28),
        [
          ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
          ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
          ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
          ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
        ]
      )
    );
    expect(res).to.be.an.equalResultTo(new Result(
      true,
      false,
      new StrictParseError(
        new SourcePos("main", 496, 6, 28),
        [
          ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
          ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
          ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
          ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
        ]
      )
    ));
  });
});

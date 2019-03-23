"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, StrictParseError } = _error;
const { Result } = _parser;

describe(".eerr", () => {
  it("should create an empty failure result object", () => {
    const res = Result.eerr(
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
    expect(res).to.be.an.equalResultTo({
      success : false,
      consumed: false,
      err     : new StrictParseError(
        new SourcePos("main", 496, 6, 28),
        [
          ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
          ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
          ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
          ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
        ]
      ),
    });
  });
});

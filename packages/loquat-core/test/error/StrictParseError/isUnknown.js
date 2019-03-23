"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, StrictParseError } = _error;

describe("#isUnknown", () => {
  it("should return `true` if the error messages list is empty", () => {
    const pos = new SourcePos("main", 496, 6, 28);
    const err = new StrictParseError(pos, []);
    expect(err.isUnknown()).to.be.true;
  });

  it("should return `false` if the error messages list is not empty", () => {
    const pos = new SourcePos("main", 496, 6, 28);
    const msgs = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
      new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
    ];
    const err = new StrictParseError(pos, msgs);
    expect(err.isUnknown()).to.be.false;
  });
});

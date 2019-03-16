"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, ParseError } = _error;

describe("#isUnknown", () => {
  it("should return `true` if the error messages list is empty", () => {
    const pos = new SourcePos("mains", 6, 28);
    const err = new ParseError(pos, []);
    expect(err.isUnknown()).to.be.true;
  });

  it("should return `false` if the error messages list is not empty", () => {
    const pos = new SourcePos("mains", 6, 28);
    const msgs = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
      new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
    ];
    const err = new ParseError(pos, msgs);
    expect(err.isUnknown()).to.be.false;
  });
});

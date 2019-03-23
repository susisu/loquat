"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, ParseError } = _error;

describe("#setMessages", () => {
  it("should create a new parse error with `msgs` updated", () => {
    const pos = new SourcePos("main", 6, 28);
    const msgs = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
      new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
    ];
    const err = new ParseError(pos, msgs);
    const newMsgs = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "A"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "B"),
      new ErrorMessage(ErrorMessageType.EXPECT, "C"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "D"),
    ];
    const newErr = err.setMessages(newMsgs);
    expect(newErr).to.not.equal(err);
    expect(newErr).to.be.an.equalErrorTo(new ParseError(pos, newMsgs));
  });
});

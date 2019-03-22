"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, ParseError, LazyParseError } = _error;

describe("#setMessages", () => {
  it("should create a new parse error with `msgs` updated", () => {
    const pos = new SourcePos("main", 6, 28);
    const msgs = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
      new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
    ];
    let evaluated = false;
    const err = new LazyParseError(() => {
      evaluated = true;
      return new ParseError(pos, msgs);
    });
    const newMsgs = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "A"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "B"),
      new ErrorMessage(ErrorMessageType.EXPECT, "C"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "D"),
    ];
    const newErr = err.setMessages(newMsgs);
    expect(evaluated).to.be.false; // not evaluated yet
    expect(newErr.pos).to.be.an.equalPositionTo(pos);
    expect(newErr.msgs).to.be.equalErrorMessagesTo(newMsgs);
    expect(evaluated).to.be.true;
  });
});

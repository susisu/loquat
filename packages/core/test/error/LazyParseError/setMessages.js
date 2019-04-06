"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, StrictParseError, LazyParseError } = _error;

describe("#setMessages", () => {
  it("should create a new parse error with `msgs` updated", () => {
    const pos = new SourcePos("main", 496, 6, 28);
    const msgs = [
      ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
      ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
      ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
    ];
    let evaluated = false;
    const err = new LazyParseError(() => {
      evaluated = true;
      return new StrictParseError(pos, msgs);
    });
    const newMsgs = [
      ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "A"),
      ErrorMessage.create(ErrorMessageType.UNEXPECT, "B"),
      ErrorMessage.create(ErrorMessageType.EXPECT, "C"),
      ErrorMessage.create(ErrorMessageType.MESSAGE, "D"),
    ];
    const newErr = err.setMessages(newMsgs);
    expect(evaluated).to.be.false; // not evaluated yet
    expect(SourcePos.equal(newErr.pos, pos)).to.be.true;
    expect(ErrorMessage.messagesEqual(newErr.msgs, newMsgs)).to.be.true;
    expect(evaluated).to.be.true;
  });
});

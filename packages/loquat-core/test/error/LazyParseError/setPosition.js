"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, StrictParseError, LazyParseError } = _error;

describe("#setPosition", () => {
  it("should create a new parse error with `pos` updated", () => {
    const pos = new SourcePos("main", 496, 6, 28);
    const msgs = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
      new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
    ];
    let evaluated = false;
    const err = new LazyParseError(() => {
      evaluated = true;
      return new StrictParseError(pos, msgs);
    });
    const newPos = new SourcePos("lib", 506, 7, 29);
    const newErr = err.setPosition(newPos);
    expect(evaluated).to.be.false; // not evaluated yet
    expect(newErr.pos).to.be.an.equalPositionTo(newPos);
    expect(newErr.msgs).to.be.equalErrorMessagesTo(msgs);
    expect(evaluated).to.be.true;
  });
});

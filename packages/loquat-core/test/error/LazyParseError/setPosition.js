"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, StrictParseError, LazyParseError } = _error;

describe("#setPosition", () => {
  it("should create a new parse error with `pos` updated", () => {
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
    const newPos = new SourcePos("lib", 506, 7, 29);
    const newErr = err.setPosition(newPos);
    expect(evaluated).to.be.false; // not evaluated yet
    expect(SourcePos.equal(newErr.pos, newPos)).to.be.true;
    expect(newErr.msgs).to.be.equalErrorMessagesTo(msgs);
    expect(evaluated).to.be.true;
  });
});

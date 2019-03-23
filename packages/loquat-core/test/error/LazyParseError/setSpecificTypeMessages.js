"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, StrictParseError, LazyParseError } = _error;

describe("#setSpecificTypeMessages", () => {
  it("should create a new parse error with all of the specified type of messages removed and the"
    + " new messages added", () => {
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
    const newErr = err.setSpecificTypeMessages(ErrorMessageType.UNEXPECT, ["A", "B"]);
    expect(evaluated).to.be.false; // not evaluated yet
    expect(newErr.pos).to.be.an.equalPositionTo(pos);
    expect(newErr.msgs).to.be.equalErrorMessagesTo([
      ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
      ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
      ErrorMessage.create(ErrorMessageType.UNEXPECT, "A"),
      ErrorMessage.create(ErrorMessageType.UNEXPECT, "B"),
    ]);
    expect(evaluated).to.be.true;
  });
});

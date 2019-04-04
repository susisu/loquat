"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, StrictParseError, LazyParseError } = _error;

describe("#addMessages", () => {
  it("should return a new parse error with the given messages added", () => {
    const pos = new SourcePos("main", 496, 6, 28);
    const msgs = [
      ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
    ];
    let evaluated = false;
    const err = new LazyParseError(() => {
      evaluated = true;
      return new StrictParseError(pos, msgs);
    });
    const additionalMsgs = [
      ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
      ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
    ];
    const newErr = err.addMessages(additionalMsgs);
    expect(evaluated).to.be.false; // not evaluated yet
    expect(SourcePos.equal(newErr.pos, pos)).to.be.true;
    expect(newErr.msgs).to.be.equalErrorMessagesTo(msgs.concat(additionalMsgs));
    expect(evaluated).to.be.true;
  });
});

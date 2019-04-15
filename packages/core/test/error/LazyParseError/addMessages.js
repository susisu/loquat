"use strict";

const { expect } = require("chai");

const { SourcePos } = $pos;
const { ErrorMessageType, ErrorMessage, StrictParseError, LazyParseError } = $error;

describe("#addMessages", () => {
  it("should return a new parse error with the given messages added", () => {
    const pos = new SourcePos("main", 6, 28);
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
    expect(ErrorMessage.messagesEqual(newErr.msgs, msgs.concat(additionalMsgs))).to.be.true;
    expect(evaluated).to.be.true;
  });
});

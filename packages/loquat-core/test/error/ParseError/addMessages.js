"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, AbstractParseError, ParseError } = _error;

describe("#addMessages", () => {
  it("should return a new parse error with the given messages added", () => {
    const pos = new SourcePos("main", 6, 28);
    const msgs = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
    ];
    const err = new ParseError(pos, msgs);
    const additionalMsgs = [
      new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
    ];
    const newErr = err.addMessages(additionalMsgs);
    expect(newErr).to.be.an.instanceOf(AbstractParseError);
    expect(newErr.pos).to.be.an.equalPositionTo(pos);
    expect(newErr.msgs).to.be.equalErrorMessagesTo(msgs.concat(additionalMsgs));
  });
});

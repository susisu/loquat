"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, AbstractParseError, ParseError } = _error;

describe("#setSpecificTypeMessages", () => {
  it("should create a new parse error with all of the specified type of messages removed and the"
    + " new messages added", () => {
    const pos = new SourcePos("main", 6, 28);
    const msgs = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
      new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
    ];
    const err = new ParseError(pos, msgs);
    const newErr = err.setSpecificTypeMessages(ErrorMessageType.UNEXPECT, ["A", "B"]);
    expect(newErr).to.be.an.instanceOf(AbstractParseError);
    expect(newErr).to.not.equal(err);
    expect(SourcePos.equal(newErr.pos, pos)).to.be.true;
    expect(ErrorMessage.messagesEqual(newErr.msgs, [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "A"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "B"),
    ])).to.be.true;
  });
});

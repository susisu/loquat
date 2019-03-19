"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, AbstractParseError, ParseError } = _error;

describe("#setPosition", () => {
  it("should create a new parse error with `pos` updated", () => {
    const pos = new SourcePos("main", 6, 28);
    const msgs = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
      new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
    ];
    const err = new ParseError(pos, msgs);
    const newPos = new SourcePos("main", 6, 29);
    const newErr = err.setPosition(newPos);
    expect(newErr).to.be.an.instanceOf(AbstractParseError);
    expect(newErr).to.not.equal(err);
    expect(SourcePos.equal(newErr.pos, newPos)).to.be.true;
    expect(ErrorMessage.messagesEqual(newErr.msgs, msgs)).to.be.true;
  });
});

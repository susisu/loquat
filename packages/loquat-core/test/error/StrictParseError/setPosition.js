"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, StrictParseError } = _error;

describe("#setPosition", () => {
  it("should create a new parse error with `pos` updated", () => {
    const pos = new SourcePos("main", 496, 6, 28);
    const msgs = [
      ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
      ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
      ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
    ];
    const err = new StrictParseError(pos, msgs);
    const newPos = new SourcePos("main", 506, 7, 29);
    const newErr = err.setPosition(newPos);
    expect(newErr).to.not.equal(err);
    expect(newErr).to.be.an.equalErrorTo(new StrictParseError(newPos, msgs));
  });
});

"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, StrictParseError } = _error;

describe("#setSpecificTypeMessages", () => {
  it("should create a new parse error with all of the specified type of messages removed and the"
    + " new messages added", () => {
    const pos = new SourcePos("main", 496, 6, 28);
    const msgs = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
      new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
    ];
    const err = new StrictParseError(pos, msgs);
    const newErr = err.setSpecificTypeMessages(ErrorMessageType.UNEXPECT, ["A", "B"]);
    expect(newErr).to.not.equal(err);
    expect(newErr).to.be.an.equalErrorTo(new StrictParseError(
      pos,
      [
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
        new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
        new ErrorMessage(ErrorMessageType.UNEXPECT, "A"),
        new ErrorMessage(ErrorMessageType.UNEXPECT, "B"),
      ]
    ));
  });
});

"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, StrictParseError } = _error;

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
    const err = new StrictParseError(pos, msgs);
    const newErr = err.setSpecificTypeMessages(ErrorMessageType.UNEXPECT, ["A", "B"]);
    expect(newErr).to.not.equal(err);
    expect(newErr).to.be.an.equalErrorTo(new StrictParseError(
      pos,
      [
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "A"),
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "B"),
      ]
    ));
  });
});

"use strict";

const { expect } = require("chai");

const { ErrorMessageType, ErrorMessage, AbstractParseError } = _error;

describe("#setMessages", () => {
  it("should throw `Error` because not implemented", () => {
    const TestParseError = class extends AbstractParseError {
      constructor() {
        super();
      }
    };
    const err = new TestParseError();
    const msgs = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
      new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
    ];
    expect(() => { err.setMessages(msgs); }).to.throw(Error, /not implemented/i);
  });
});

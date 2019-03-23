"use strict";

const { expect } = require("chai");

const { ErrorMessageType, ErrorMessage, ParseError } = _error;

describe("#setMessages", () => {
  it("should throw `Error` because not implemented", () => {
    const TestParseError = class extends ParseError {
      constructor() {
        super();
      }
    };
    const err = new TestParseError();
    const msgs = [
      ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
      ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
      ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
    ];
    expect(() => { err.setMessages(msgs); }).to.throw(Error, /not implemented/i);
  });
});

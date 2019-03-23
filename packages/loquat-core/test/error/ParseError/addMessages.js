"use strict";

const { expect } = require("chai");

const { ErrorMessageType, ErrorMessage, ParseError } = _error;

describe("#addMessages", () => {
  it("should throw `Error` because not implemented", () => {
    const TestParseError = class extends ParseError {
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
    expect(() => { err.addMessages(msgs); }).to.throw(Error, /not implemented/i);
  });
});

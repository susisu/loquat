"use strict";

const { expect } = require("chai");

const { ErrorMessageType, AbstractParseError } = _error;

describe("#setSpecificTypeMessages", () => {
  it("should throw `Error` because not implemented", () => {
    const TestParseError = class extends AbstractParseError {
      constructor() {
        super();
      }
    };
    const err = new TestParseError();
    expect(() => {
      err.setSpecificTypeMessages(ErrorMessageType.MESSAGE, ["foo", "bar", "baz"]);
    }).to.throw(Error, /not implemented/i);
  });
});

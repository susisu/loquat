"use strict";

const { expect } = require("chai");

const { ErrorMessageType, ParseError } = $error;

describe("#setSpecificTypeMessages", () => {
  it("should throw `Error` because not implemented", () => {
    const TestParseError = class extends ParseError {
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

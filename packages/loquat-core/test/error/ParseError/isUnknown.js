"use strict";

const { expect } = require("chai");

const { ParseError } = _error;

describe("#isUnknown", () => {
  it("should throw `Error` because not implemented", () => {
    const TestParseError = class extends ParseError {
      constructor() {
        super();
      }
    };
    const err = new TestParseError();
    expect(() => { err.isUnknown(); }).to.throw(Error, /not implemented/i);
  });
});

"use strict";

const { expect } = require("chai");

const { ParseError } = _error;

describe("#msgs", () => {
  it("should throw `Error` because not implemented", () => {
    const TestParseError = class extends ParseError {
      constructor() {
        super();
      }
    };
    const err = new TestParseError();
    expect(() => { err.msgs; }).to.throw(Error, /not implemented/i);
  });
});

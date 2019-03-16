"use strict";

const { expect } = require("chai");

const { AbstractParseError } = _error;

describe("#pos", () => {
  it("should throw an `Error` because not implemented", () => {
    const TestParseError = class extends AbstractParseError {
      constructor() {
        super();
      }
    };
    const err = new TestParseError();
    expect(() => { err.pos; }).to.throw(Error, /not implemented/i);
  });
});

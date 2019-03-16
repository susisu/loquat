"use strict";

const { expect } = require("chai");

const { AbstractParseError } = _error;

describe("#isUnknown", () => {
  it("should throw `Error` because not implemented", () => {
    const TestParseError = class extends AbstractParseError {
      constructor() {
        super();
      }
    };
    const err = new TestParseError();
    expect(() => { err.isUnknown(); }).to.throw(Error, /not implemented/i);
  });
});

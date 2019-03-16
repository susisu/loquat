"use strict";

const { expect } = require("chai");

const { AbstractParseError } = _error;

describe("#toString", () => {
  it("should throw `Error` because not implemented", () => {
    const TestParseError = class extends AbstractParseError {
      constructor() {
        super();
      }
    };
    const err = new TestParseError();
    expect(() => { err.toString(); }).to.throw(Error, /not implemented/i);
  });
});

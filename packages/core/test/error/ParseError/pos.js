"use strict";

const { expect } = require("chai");

const { ParseError } = $error;

describe("#pos", () => {
  it("should throw an `Error` because not implemented", () => {
    const TestParseError = class extends ParseError {
      constructor() {
        super();
      }
    };
    const err = new TestParseError();
    expect(() => { err.pos; }).to.throw(Error, /not implemented/i);
  });
});

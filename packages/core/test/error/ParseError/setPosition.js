"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ParseError } = _error;

describe("#setPosition", () => {
  it("should throw `Error` because not implemented", () => {
    const TestParseError = class extends ParseError {
      constructor() {
        super();
      }
    };
    const err = new TestParseError();
    const pos = new SourcePos("main", 496, 6, 28);
    expect(() => { err.setPosition(pos); }).to.throw(Error, /not implemented/i);
  });
});

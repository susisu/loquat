"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ParseError, StrictParseError } = _error;

describe(".unknown", () => {
  it("should create a new parse error describing with empty error messages", () => {
    const pos = new SourcePos("main", 496, 6, 28);
    const err = ParseError.unknown(pos);
    expect(err).to.be.an.equalErrorTo(new StrictParseError(pos, []));
  });
});

"use strict";

const { expect } = require("chai");

const { SourcePos } = $pos;
const { ParseError, StrictParseError } = $error;

describe(".unknown", () => {
  it("should create a new parse error describing with empty error messages", () => {
    const pos = new SourcePos("main", 496, 6, 28);
    const err = ParseError.unknown(pos);
    expect(ParseError.equal(err, new StrictParseError(pos, []))).to.be.true;
  });
});

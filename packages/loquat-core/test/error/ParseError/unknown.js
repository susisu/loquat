"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ParseError } = _error;

describe(".unknown", () => {
  it("should create a new parse error describing with empty error messages", () => {
    const pos = new SourcePos("main", 6, 28);
    const err = ParseError.unknown(pos);
    expect(err).to.be.an.equalErrorTo(new ParseError(pos, []));
  });
});

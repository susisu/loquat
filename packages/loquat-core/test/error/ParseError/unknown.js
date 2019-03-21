"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessage, ParseError } = _error;

describe(".unknown", () => {
  it("should create a new parse error describing with empty error messages", () => {
    const pos = new SourcePos("main", 6, 28);
    const err = ParseError.unknown(pos);
    expect(err).to.be.an.instanceOf(ParseError);
    expect(err.pos).to.be.an.equalPositionTo(pos);
    expect(ErrorMessage.messagesEqual(err.msgs, [])).to.be.true;
  });
});

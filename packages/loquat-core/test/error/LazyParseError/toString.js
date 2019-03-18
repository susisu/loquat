"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, ParseError, LazyParseError } = _error;

describe("#toString", () => {
  it("should return a string representation of the error", () => {
    const pos = new SourcePos("main", 6, 28);
    const msgs = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
      new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
    ];
    let evaluated = false;
    const err = new LazyParseError(() => {
      evaluated = true;
      return new ParseError(pos, msgs);
    });
    expect(err.toString()).to.equal([
      "\"main\"(line 6, column 28):",
      "unexpected bar",
      "expecting baz",
      "qux",
    ].join("\n"));
    expect(evaluated).to.be.true;
  });
});

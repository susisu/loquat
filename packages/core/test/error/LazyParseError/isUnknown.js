"use strict";

const { expect } = require("chai");

const { SourcePos } = $pos;
const { ErrorMessageType, ErrorMessage, StrictParseError, LazyParseError } = $error;

describe("#isUnknown", () => {
  it("should return `true` if the error messages list is empty", () => {
    const pos = new SourcePos("main", 496, 6, 28);
    let evaluated = false;
    const err = new LazyParseError(() => {
      evaluated = true;
      return new StrictParseError(pos, []);
    });
    expect(err.isUnknown()).to.be.true;
    expect(evaluated).to.be.true;
  });

  it("should return `false` if the error messages list is not empty", () => {
    const pos = new SourcePos("main", 496, 6, 28);
    const msgs = [
      ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
      ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
      ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
    ];
    let evaluated = false;
    const err = new LazyParseError(() => {
      evaluated = true;
      return new StrictParseError(pos, msgs);
    });
    expect(err.isUnknown()).to.be.false;
    expect(evaluated).to.be.true;
  });
});

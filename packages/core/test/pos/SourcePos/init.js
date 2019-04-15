"use strict";

const { expect } = require("chai");

const { SourcePos } = $pos;

describe(".init", () => {
  it("should create a new `SourcePos' instance with `(line, column) = (1, 1)`", () => {
    const pos = SourcePos.init("foo");
    expect(SourcePos.equal(pos, new SourcePos("foo", 1, 1))).to.be.true;
  });
});

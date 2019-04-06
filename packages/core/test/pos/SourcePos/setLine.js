"use strict";

const { expect } = require("chai");

const { SourcePos } = $pos;

describe("#setLine", () => {
  it("should create a copy of the position with `line` updated", () => {
    const pos  = new SourcePos("foo", 496, 6, 28);
    const copy = pos.setLine(7);
    expect(copy).to.not.equal(pos);
    expect(SourcePos.equal(copy, new SourcePos("foo", 496, 7, 28))).to.be.true;
  });
});

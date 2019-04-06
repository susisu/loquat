"use strict";

const { expect } = require("chai");

const { SourcePos } = $pos;

describe("#setColumn", () => {
  it("should create a copy of the position with `column` updated", () => {
    const pos = new SourcePos("foo", 496, 6, 28);
    const copy = pos.setColumn(29);
    expect(copy).to.not.equal(pos);
    expect(SourcePos.equal(copy, new SourcePos("foo", 496, 6, 29))).to.be.true;
  });
});

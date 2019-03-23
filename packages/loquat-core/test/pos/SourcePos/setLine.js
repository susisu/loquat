"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;

describe("#setLine", () => {
  it("should create a copy of the position with `line` updated", () => {
    const pos  = new SourcePos("foo", 6, 28);
    const copy = pos.setLine(7);
    expect(copy).to.not.equal(pos);
    expect(copy).to.be.an.equalPositionTo(new SourcePos("foo", 7, 28));
  });
});

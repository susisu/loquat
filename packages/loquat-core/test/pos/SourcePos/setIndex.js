"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;

describe("#setIndex", () => {
  it("should create a copy of the position with `index` updated", () => {
    const pos  = new SourcePos("foo", 496, 6, 28);
    const copy = pos.setIndex(497);
    expect(copy).to.not.equal(pos);
    expect(copy).to.be.an.equalPositionTo(new SourcePos("foo", 497, 6, 28));
  });
});

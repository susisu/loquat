"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;

describe("#setColumn", () => {
  it("should create a copy of the position with `column` updated", () => {
    const pos = new SourcePos("foo", 496, 6, 28);
    const copy = pos.setColumn(29);
    expect(copy).to.not.equal(pos);
    expect(copy).to.be.an.equalPositionTo(new SourcePos("foo", 496, 6, 29));
  });
});

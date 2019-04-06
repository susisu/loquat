"use strict";

const { expect } = require("chai");

const { SourcePos } = $pos;

describe("#setName", () => {
  it("should create a copy of the position with `name` updated", () => {
    const pos = new SourcePos("foo", 496, 6, 28);
    const copy = pos.setName("bar");
    expect(copy).to.not.equal(pos);
    expect(SourcePos.equal(copy, new SourcePos("bar", 496, 6, 28))).to.be.true;
  });
});

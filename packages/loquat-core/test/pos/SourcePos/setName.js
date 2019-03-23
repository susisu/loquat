"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;

describe("#setName", () => {
  it("should create a copy of the position with `name` updated", () => {
    const pos = new SourcePos("foo", 6, 28);
    const copy = pos.setName("bar");
    expect(copy).to.not.equal(pos);
    expect(copy).to.be.an.equalPositionTo(new SourcePos("bar", 6, 28));
  });
});

"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;

describe("#setLine", () => {
  it("should create a copy of the position with `line` updated", () => {
    const pos  = new SourcePos("foo", 6, 28);
    const copy = pos.setLine(7);
    expect(copy).to.be.an.instanceOf(SourcePos);
    // different objects
    expect(copy).not.to.equal(pos);
    // only the lines differ
    expect(copy.name).to.equal(pos.name);
    expect(copy.line).to.equal(7);
    expect(copy.column).to.equal(pos.column);
  });
});

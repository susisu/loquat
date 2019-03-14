"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;

describe("#setName", () => {
  it("should create a copy of the position with `name` updated", () => {
    const pos = new SourcePos("foo", 6, 28);
    const copy = pos.setName("bar");
    expect(copy).to.be.an.instanceOf(SourcePos);
    // different objects
    expect(copy).not.to.equal(pos);
    // only the names differ
    expect(copy.name).to.equal("bar");
    expect(copy.line).to.equal(pos.line);
    expect(copy.column).to.equal(pos.column);
  });
});

"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;

describe("#setColumn", () => {
  it("should create a copy of the position with `column` updated", () => {
    const pos = new SourcePos("foo", 6, 28);
    const copy = pos.setColumn(29);
    expect(copy).to.be.an.instanceOf(SourcePos);
    // different objects
    expect(copy).not.to.equal(pos);
    // only the columns differ
    expect(copy.name).to.equal(pos.name);
    expect(copy.line).to.equal(pos.line);
    expect(copy.column).to.equal(29);
  });
});

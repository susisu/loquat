"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;

describe(".init", () => {
  it("should create a new `SourcePos' instance with `(index, line, column) = (0, 1, 1)`", () => {
    const pos = SourcePos.init("foo");
    expect(pos).to.be.an.equalPositionTo(new SourcePos("foo", 0, 1, 1));
  });
});

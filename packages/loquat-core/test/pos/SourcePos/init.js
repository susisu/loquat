"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;

describe(".init", () => {
  it("should create a new `SourcePos' instance with `(line, column) = (1, 1)`", () => {
    const pos = SourcePos.init("foo");
    expect(pos).to.be.an.equalPositionTo(new SourcePos("foo", 1, 1));
  });
});

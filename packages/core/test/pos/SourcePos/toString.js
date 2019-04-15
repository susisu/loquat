"use strict";

const { expect } = require("chai");

const { SourcePos } = $pos;

describe("#toString", () => {
  it("should return a string representation of the position", () => {
    // If `name` is not empty, the result contains it.
    {
      const pos = new SourcePos("foo", 6, 28);
      expect(pos.toString()).to.equal("\"foo\"(line 6, column 28)");
    }
    // If `name` is empty, the result does not contain it.
    {
      const pos = new SourcePos("", 6, 28);
      expect(pos.toString()).to.equal("(line 6, column 28)");
    }
  });
});

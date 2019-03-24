"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;

describe("#addString", () => {
  it("should create a new position with `line` and `column` are offset by the given string", () => {
    {
      const pos = new SourcePos("foo", 496, 6, 1);
      const copy = pos.addString("nyan\n\tcat\n\u3042\t\uD83C\uDF63", 8, false);
      expect(copy).to.not.equal(pos);
      expect(copy).to.be.an.equalPositionTo(new SourcePos("foo", 510, 8, 11));
    }
    {
      const pos = new SourcePos("foo", 496, 6, 1);
      const copy = pos.addString("nyan\n\tcat\n\u3042\t\uD83C\uDF63", 4, false);
      expect(copy).to.not.equal(pos);
      expect(copy).to.be.an.equalPositionTo(new SourcePos("foo", 510, 8, 7));
    }
  });

  it("should count characters in units of code points if the unicode flag is set to true", () => {
    const pos = new SourcePos("foo", 496, 6, 1);
    const copy = pos.addString("nyan\n\tcat\n\u3042\t\uD83C\uDF63", 8, true);
    expect(copy).to.not.equal(pos);
    // the offset in index is not affected by the unicode flag
    expect(copy).to.be.an.equalPositionTo(new SourcePos("foo", 510, 8, 10));
  });
});

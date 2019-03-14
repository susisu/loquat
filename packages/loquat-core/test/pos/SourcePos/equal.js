"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;

describe(".equal", () => {
  it("should return true if two positions are equal", () => {
    const posA = new SourcePos("foo", 6, 28);
    const posB = new SourcePos("foo", 6, 28);
    expect(SourcePos.equal(posA, posB)).to.be.true;
    expect(SourcePos.equal(posB, posA)).to.be.true;
  });

  it("should return false if two positions are different", () => {
    // different files
    {
      const posA = new SourcePos("foo", 6, 28);
      const posB = new SourcePos("bar", 6, 28);
      expect(SourcePos.equal(posA, posB)).to.be.false;
      expect(SourcePos.equal(posB, posA)).to.be.false;
    }
    // different lines
    {
      const posA = new SourcePos("foo", 6, 28);
      const posB = new SourcePos("foo", 7, 28);
      expect(SourcePos.equal(posA, posB)).to.be.false;
      expect(SourcePos.equal(posB, posA)).to.be.false;
    }
    // different columns
    {
      const posA = new SourcePos("foo", 6, 28);
      const posB = new SourcePos("foo", 6, 29);
      expect(SourcePos.equal(posA, posB)).to.be.false;
      expect(SourcePos.equal(posB, posA)).to.be.false;
    }
    // all different
    {
      const posA = new SourcePos("foo", 6, 28);
      const posB = new SourcePos("bar", 7, 29);
      expect(SourcePos.equal(posA, posB)).to.be.false;
      expect(SourcePos.equal(posB, posA)).to.be.false;
    }
  });
});

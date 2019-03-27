"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;

describe("#addChar", () => {
  it("should create a copy without any change if an empty string is given", () => {
    const pos = new SourcePos("foo", 496, 6, 28);
    const copy = pos.addChar("", 8);
    expect(copy).to.not.equal(pos);
    expect(copy).to.be.an.equalPositionTo(pos);
  });

  it("should create a new position with `line` incremented by 1 and `column` set to 1 if LF (0xA)"
    + " is given", () => {
    const pos = new SourcePos("foo", 496, 6, 28);
    const copy = pos.addChar("\n", 8);
    expect(copy).to.not.equal(pos);
    expect(copy).to.be.an.equalPositionTo(new SourcePos("foo", 497, 7, 1));
  });

  it("should create a new position with `column` incremented by the specified tab width if TAB"
    + " (0x9) is given", () => {
    {
      const pos = new SourcePos("foo", 496, 6, 1);
      const copy = pos.addChar("\t", 8);
      expect(copy).to.not.equal(pos);
      expect(copy).to.be.an.equalPositionTo(new SourcePos("foo", 497, 6, 9));
    }
    {
      const pos = new SourcePos("foo", 496, 6, 5);
      const copy = pos.addChar("\t", 8);
      expect(copy).to.not.equal(pos);
      expect(copy).to.be.an.equalPositionTo(new SourcePos("foo", 497, 6, 9));
    }
    {
      const pos = new SourcePos("foo", 496, 6, 10);
      const copy = pos.addChar("\t", 8);
      expect(copy).to.not.equal(pos);
      expect(copy).to.be.an.equalPositionTo(new SourcePos("foo", 497, 6, 17));
    }
    {
      const pos = new SourcePos("foo", 496, 6, 1);
      const copy = pos.addChar("\t", 4);
      expect(copy).to.not.equal(pos);
      expect(copy).to.be.an.equalPositionTo(new SourcePos("foo", 497, 6, 5));
    }
    {
      const pos = new SourcePos("foo", 496, 6, 3);
      const copy = pos.addChar("\t", 4);
      expect(copy).to.not.equal(pos);
      expect(copy).to.be.an.equalPositionTo(new SourcePos("foo", 497, 6, 5));
    }
    {
      const pos = new SourcePos("foo", 496, 6, 6);
      const copy = pos.addChar("\t", 4);
      expect(copy).to.not.equal(pos);
      expect(copy).to.be.an.equalPositionTo(new SourcePos("foo", 497, 6, 9));
    }
  });

  it("should create a position with `column` incremented by 1 if any other character is"
    + " given", () => {
    {
      const pos = new SourcePos("foo", 496, 6, 28);
      const copy = pos.addChar("A", 8);
      expect(copy).to.not.equal(pos);
      expect(copy).to.be.an.equalPositionTo(new SourcePos("foo", 497, 6, 29));
    }
    {
      const pos = new SourcePos("foo", 496, 6, 28);
      const copy = pos.addChar("\u3042", 8);
      expect(copy).to.not.equal(pos);
      expect(copy).to.be.an.equalPositionTo(new SourcePos("foo", 497, 6, 29));
    }
    {
      const pos = new SourcePos("foo", 496, 6, 28);
      const copy = pos.addChar("\uD83C\uDF63", 8);
      expect(copy).to.not.equal(pos);
      expect(copy).to.be.an.equalPositionTo(new SourcePos("foo", 498, 6, 29));
    }
  });
});

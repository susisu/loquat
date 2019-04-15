"use strict";

const { expect } = require("chai");

const { SourcePos } = $pos;

describe("#addChar", () => {
  it("should create a copy without any change if an empty string is given", () => {
    const pos = new SourcePos("foo", 6, 28);
    const copy = pos.addChar("", 8);
    expect(copy).to.not.equal(pos);
    expect(SourcePos.equal(copy, pos)).to.be.true;
  });

  it("should create a new position with `line` incremented by 1 and `column` set to 1 if LF (0xA)"
    + " is given", () => {
    const pos = new SourcePos("foo", 6, 28);
    const copy = pos.addChar("\n", 8);
    expect(copy).to.not.equal(pos);
    expect(SourcePos.equal(copy, new SourcePos("foo", 7, 1))).to.be.true;
  });

  it("should create a new position with `column` incremented by the specified tab width if TAB"
    + " (0x9) is given", () => {
    {
      const pos = new SourcePos("foo", 6, 1);
      const copy = pos.addChar("\t", 8);
      expect(copy).to.not.equal(pos);
      expect(SourcePos.equal(copy, new SourcePos("foo", 6, 9))).to.be.true;
    }
    {
      const pos = new SourcePos("foo", 6, 5);
      const copy = pos.addChar("\t", 8);
      expect(copy).to.not.equal(pos);
      expect(SourcePos.equal(copy, new SourcePos("foo", 6, 9))).to.be.true;
    }
    {
      const pos = new SourcePos("foo", 6, 10);
      const copy = pos.addChar("\t", 8);
      expect(copy).to.not.equal(pos);
      expect(SourcePos.equal(copy, new SourcePos("foo", 6, 17))).to.be.true;
    }
    {
      const pos = new SourcePos("foo", 6, 1);
      const copy = pos.addChar("\t", 4);
      expect(copy).to.not.equal(pos);
      expect(SourcePos.equal(copy, new SourcePos("foo", 6, 5))).to.be.true;
    }
    {
      const pos = new SourcePos("foo", 6, 3);
      const copy = pos.addChar("\t", 4);
      expect(copy).to.not.equal(pos);
      expect(SourcePos.equal(copy, new SourcePos("foo", 6, 5))).to.be.true;
    }
    {
      const pos = new SourcePos("foo", 6, 6);
      const copy = pos.addChar("\t", 4);
      expect(copy).to.not.equal(pos);
      expect(SourcePos.equal(copy, new SourcePos("foo", 6, 9))).to.be.true;
    }
  });

  it("should create a position with `column` incremented by 1 if any other character is"
    + " given", () => {
    {
      const pos = new SourcePos("foo", 6, 28);
      const copy = pos.addChar("A", 8);
      expect(copy).to.not.equal(pos);
      expect(SourcePos.equal(copy, new SourcePos("foo", 6, 29))).to.be.true;
    }
    {
      const pos = new SourcePos("foo", 6, 28);
      const copy = pos.addChar("\u3042", 8);
      expect(copy).to.not.equal(pos);
      expect(SourcePos.equal(copy, new SourcePos("foo", 6, 29))).to.be.true;
    }
    {
      const pos = new SourcePos("foo", 6, 28);
      const copy = pos.addChar("\uD83C\uDF63", 8);
      expect(copy).to.not.equal(pos);
      expect(SourcePos.equal(copy, new SourcePos("foo", 6, 29))).to.be.true;
    }
  });
});

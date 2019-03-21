"use strict";

const { expect, AssertionError } = require("chai");

const { SourcePos } = _core;

describe("equalPositionTo", () => {
  it("should throw AssertionError if the actual position is not equal to the expected one", () => {
    // name
    expect(() => {
      expect(new SourcePos("main", 6, 28)).to.be.an.equalPositionTo(new SourcePos("lib", 6, 28));
    }).to.throw(AssertionError);
    // lines
    expect(() => {
      expect(new SourcePos("main", 6, 28)).to.be.an.equalPositionTo(new SourcePos("main", 7, 28));
    }).to.throw(AssertionError);
    // column
    expect(() => {
      expect(new SourcePos("main", 6, 28)).to.be.an.equalPositionTo(new SourcePos("main", 6, 29));
    }).to.throw(AssertionError);
    // all
    expect(() => {
      expect(new SourcePos("main", 6, 28)).to.be.an.equalPositionTo(new SourcePos("lib", 7, 29));
    }).to.throw(AssertionError);
  });

  it("should not throw AssertionError if the actual position is equal to the expected one", () => {
    expect(() => {
      expect(new SourcePos("main", 6, 28)).to.be.an.equalPositionTo(new SourcePos("main", 6, 28));
    }).to.not.throw(AssertionError);
  });

  it("should throw AssertionError if the object is not a `SourcePos` instance", () => {
    expect(() => {
      expect({}).to.be.an.equalPositionTo(new SourcePos("main", 6, 28));
    }).to.throw(AssertionError);
    expect(() => {
      expect({}).to.not.be.an.equalPositionTo(new SourcePos("main", 6, 28));
    }).to.throw(AssertionError);
  });
});

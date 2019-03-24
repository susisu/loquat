"use strict";

const { expect, AssertionError } = require("chai");

const { SourcePos } = _core;

describe("equalPositionTo", () => {
  it("should throw AssertionError if the actual position is not equal to the expected one", () => {
    // name
    expect(() => {
      const act = new SourcePos("main", 496, 6, 28);
      const exp = new SourcePos("lib", 496, 6, 28);
      expect(act).to.be.an.equalPositionTo(exp);
    }).to.throw(AssertionError, /SourcePos/);
    // index
    expect(() => {
      const act = new SourcePos("main", 496, 6, 28);
      const exp = new SourcePos("main", 497, 6, 28);
      expect(act).to.be.an.equalPositionTo(exp);
    }).to.throw(AssertionError, /SourcePos/);
    // lines
    expect(() => {
      const act = new SourcePos("main", 496, 6, 28);
      const exp = new SourcePos("main", 496, 7, 28);
      expect(act).to.be.an.equalPositionTo(exp);
    }).to.throw(AssertionError, /SourcePos/);
    // column
    expect(() => {
      const act = new SourcePos("main", 496, 6, 28);
      const exp = new SourcePos("main", 496, 6, 29);
      expect(act).to.be.an.equalPositionTo(exp);
    }).to.throw(AssertionError, /SourcePos/);
    // all
    expect(() => {
      const act = new SourcePos("main", 496, 6, 28);
      const exp = new SourcePos("lib", 497, 7, 29);
      expect(act).to.be.an.equalPositionTo(exp);
    }).to.throw(AssertionError, /SourcePos/);
  });

  it("should not throw AssertionError if the actual position is equal to the expected one", () => {
    expect(() => {
      const act = new SourcePos("main", 496, 6, 28);
      const exp = new SourcePos("main", 496, 6, 28);
      expect(act).to.be.an.equalPositionTo(exp);
    }).to.not.throw(AssertionError);
  });

  it("should throw AssertionError if the object is not a `SourcePos` instance", () => {
    const values = [
      null,
      undefined,
      "foo",
      42,
      true,
      {},
      () => {},
    ];
    const exp = new SourcePos("main", 496, 6, 28);
    for (const act of values) {
      expect(() => {
        expect(act).to.be.an.equalPositionTo(exp);
      }).to.throw(AssertionError, /SourcePos/);
      expect(() => {
        expect(act).to.not.be.an.equalPositionTo(exp);
      }).to.throw(AssertionError, /SourcePos/);
    }
  });
});

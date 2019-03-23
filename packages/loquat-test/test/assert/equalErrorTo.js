"use strict";

const { expect, AssertionError } = require("chai");

const { SourcePos, ErrorMessageType, ErrorMessage, StrictParseError, LazyParseError } = _core;

describe("equalErrorTo", () => {
  it("should throw AssertionError if the actual error is not equal to the expected one", () => {
    // pos
    expect(() => {
      const act = new StrictParseError(
        new SourcePos("main", 496, 6, 28),
        [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
      );
      const exp = new StrictParseError(
        new SourcePos("lib", 497, 7, 29),
        [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
      );
      expect(act).to.be.an.equalErrorTo(exp);
    }).to.throw(AssertionError);
    // msgs
    expect(() => {
      const act = new StrictParseError(
        new SourcePos("main", 496, 6, 28),
        [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
      );
      const exp = new StrictParseError(
        new SourcePos("main", 496, 6, 28),
        [ErrorMessage.create(ErrorMessageType.EXPECT, "bar")]
      );
      expect(act).to.be.an.equalErrorTo(exp);
    }).to.throw(AssertionError);
    // both
    expect(() => {
      const act = new StrictParseError(
        new SourcePos("main", 496, 6, 28),
        [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
      );
      const exp = new StrictParseError(
        new SourcePos("lib", 497, 7, 29),
        [ErrorMessage.create(ErrorMessageType.EXPECT, "bar")]
      );
      expect(act).to.be.an.equalErrorTo(exp);
    }).to.throw(AssertionError);
    // strict and lazy
    expect(() => {
      const act = new StrictParseError(
        new SourcePos("main", 496, 6, 28),
        [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
      );
      const exp = new LazyParseError(() =>
        new StrictParseError(
          new SourcePos("lib", 497, 7, 29),
          [ErrorMessage.create(ErrorMessageType.EXPECT, "bar")]
        )
      );
      expect(act).to.be.an.equalErrorTo(exp);
    }).to.throw(AssertionError);
    expect(() => {
      const act = new LazyParseError(() =>
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        )
      );
      const exp = new StrictParseError(
        new SourcePos("lib", 497, 7, 29),
        [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
      );
      expect(act).to.be.an.equalErrorTo(exp);
    }).to.throw(AssertionError);
  });

  it("should not throw AssertionError if the actual error is equal to the expected one", () => {
    expect(() => {
      const act = new StrictParseError(
        new SourcePos("main", 496, 6, 28),
        [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
      );
      const exp = new StrictParseError(
        new SourcePos("main", 496, 6, 28),
        [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
      );
      expect(act).to.be.an.equalErrorTo(exp);
    }).to.not.throw(AssertionError);
    // strict and lazy
    expect(() => {
      const act = new StrictParseError(
        new SourcePos("main", 496, 6, 28),
        [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
      );
      const exp = new LazyParseError(() =>
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        )
      );
      expect(act).to.be.an.equalErrorTo(exp);
    }).to.not.throw(AssertionError);
    expect(() => {
      const act = new LazyParseError(() =>
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        )
      );
      const exp = new StrictParseError(
        new SourcePos("main", 496, 6, 28),
        [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
      );
      expect(act).to.be.an.equalErrorTo(exp);
    }).to.not.throw(AssertionError);
  });

  it("should throw AssertionError if the object is not a `ParseError` instance", () => {
    const act = {};
    const exp = new StrictParseError(
      new SourcePos("main", 496, 6, 28),
      [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
    );
    expect(() => {
      expect(act).to.be.an.equalErrorTo(exp);
    }).to.throw(AssertionError);
    expect(() => {
      expect(act).to.not.be.an.equalErrorTo(exp);
    }).to.throw(AssertionError);
  });
});

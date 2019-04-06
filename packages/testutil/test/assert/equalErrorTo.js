"use strict";

const { expect, AssertionError } = require("chai");

const { SourcePos, ErrorMessageType, ErrorMessage, StrictParseError, LazyParseError } = _core;

describe("equalErrorTo", () => {
  it("should throw AssertionError if the actual error is not equal to the expected one", () => {
    // pos
    {
      const act = new StrictParseError(
        new SourcePos("main", 496, 6, 28),
        [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
      );
      const exp = new StrictParseError(
        new SourcePos("lib", 497, 7, 29),
        [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
      );
      expect(() => {
        expect(act).to.be.an.equalErrorTo(exp);
      }).to.throw(AssertionError, /ParseError/);
      expect(() => {
        expect(act).to.be.an.equalErrorTo(new LazyParseError(() => exp));
      }).to.throw(AssertionError, /ParseError/);
      expect(() => {
        expect(new LazyParseError(() => act)).to.be.an.equalErrorTo(exp);
      }).to.throw(AssertionError, /ParseError/);
      expect(() => {
        expect(new LazyParseError(() => act)).to.be.an.equalErrorTo(new LazyParseError(() => exp));
      }).to.throw(AssertionError, /ParseError/);
    }
    // msgs
    {
      const act = new StrictParseError(
        new SourcePos("main", 496, 6, 28),
        [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
      );
      const exp = new StrictParseError(
        new SourcePos("main", 496, 6, 28),
        [ErrorMessage.create(ErrorMessageType.EXPECT, "bar")]
      );
      expect(() => {
        expect(act).to.be.an.equalErrorTo(exp);
      }).to.throw(AssertionError, /ParseError/);
      expect(() => {
        expect(act).to.be.an.equalErrorTo(new LazyParseError(() => exp));
      }).to.throw(AssertionError, /ParseError/);
      expect(() => {
        expect(new LazyParseError(() => act)).to.be.an.equalErrorTo(exp);
      }).to.throw(AssertionError, /ParseError/);
      expect(() => {
        expect(new LazyParseError(() => act)).to.be.an.equalErrorTo(new LazyParseError(() => exp));
      }).to.throw(AssertionError, /ParseError/);
    }
    // both
    {
      const act = new StrictParseError(
        new SourcePos("main", 496, 6, 28),
        [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
      );
      const exp = new StrictParseError(
        new SourcePos("lib", 497, 7, 29),
        [ErrorMessage.create(ErrorMessageType.EXPECT, "bar")]
      );
      expect(() => {
        expect(act).to.be.an.equalErrorTo(exp);
      }).to.throw(AssertionError, /ParseError/);
      expect(() => {
        expect(act).to.be.an.equalErrorTo(new LazyParseError(() => exp));
      }).to.throw(AssertionError, /ParseError/);
      expect(() => {
        expect(new LazyParseError(() => act)).to.be.an.equalErrorTo(exp);
      }).to.throw(AssertionError, /ParseError/);
      expect(() => {
        expect(new LazyParseError(() => act)).to.be.an.equalErrorTo(new LazyParseError(() => exp));
      }).to.throw(AssertionError, /ParseError/);
    }
    // negated
    {
      const act = new StrictParseError(
        new SourcePos("main", 496, 6, 28),
        [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
      );
      const exp = new StrictParseError(
        new SourcePos("main", 496, 6, 28),
        [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
      );
      expect(() => {
        expect(act).to.not.be.an.equalErrorTo(exp);
      }).to.throw(AssertionError, /ParseError/);
      expect(() => {
        expect(act).to.not.be.an.equalErrorTo(new LazyParseError(() => exp));
      }).to.throw(AssertionError, /ParseError/);
      expect(() => {
        expect(new LazyParseError(() => act)).to.not.be.an.equalErrorTo(exp);
      }).to.throw(AssertionError, /ParseError/);
      expect(() => {
        expect(new LazyParseError(() => act)).to.not.be.an.equalErrorTo(
          new LazyParseError(() => exp)
        );
      }).to.throw(AssertionError, /ParseError/);
    }
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
      expect(act).to.be.an.equalErrorTo(new LazyParseError(() => exp));
      expect(new LazyParseError(() => act)).to.be.an.equalErrorTo(exp);
      expect(new LazyParseError(() => act)).to.be.an.equalErrorTo(new LazyParseError(() => exp));
    }).to.not.throw(AssertionError);
  });

  it("should throw AssertionError if the object is not a `ParseError` instance", () => {
    const values = [
      null,
      undefined,
      "foo",
      42,
      true,
      {},
      () => {},
    ];
    const exp = new StrictParseError(
      new SourcePos("main", 496, 6, 28),
      [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
    );
    for (const act of values) {
      expect(() => {
        expect(act).to.be.an.equalErrorTo(exp);
      }).to.throw(AssertionError, /ParseError/);
      expect(() => {
        expect(act).to.not.be.an.equalErrorTo(exp);
      }).to.throw(AssertionError, /ParseError/);
      expect(() => {
        expect(act).to.be.an.equalErrorTo(new LazyParseError(() => exp));
      }).to.throw(AssertionError, /ParseError/);
      expect(() => {
        expect(act).to.not.be.an.equalErrorTo(new LazyParseError(() => exp));
      }).to.throw(AssertionError, /ParseError/);
    }
  });
});

"use strict";

const { expect } = require("chai");

const { SourcePos } = $pos;

const { ErrorMessageType, ErrorMessage, ParseError, StrictParseError, LazyParseError } = $error;

describe(".equal", () => {
  it("should return true if two errors are equal", () => {
    const posA = new SourcePos("main", 496, 6, 28);
    const msgsA = [
      ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
      ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
      ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
    ];
    const posB = new SourcePos("main", 496, 6, 28);
    const msgsB = [
      ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
      ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
      ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
    ];
    // strict
    {
      const errA = new StrictParseError(posA, msgsA);
      const errB = new StrictParseError(posB, msgsB);
      expect(ParseError.equal(errA, errB)).to.be.true;
      expect(ParseError.equal(errB, errA)).to.be.true;
    }
    // lazy
    {
      const errA = new LazyParseError(() => new StrictParseError(posA, msgsA));
      const errB = new LazyParseError(() => new StrictParseError(posB, msgsB));
      expect(ParseError.equal(errA, errB)).to.be.true;
    }
    // mixed
    {
      const errA = new StrictParseError(posA, msgsA);
      const errB = new LazyParseError(() => new StrictParseError(posB, msgsB));
      expect(ParseError.equal(errA, errB)).to.be.true;
      expect(ParseError.equal(errB, errA)).to.be.true;
    }
  });

  it("should return false if two errors are different", () => {
    // different position
    {
      const posA = new SourcePos("main", 496, 6, 28);
      const msgsA = [
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
      ];
      const posB = new SourcePos("lib", 497, 7, 29);
      const msgsB = [
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
      ];
      // strict
      {
        const errA = new StrictParseError(posA, msgsA);
        const errB = new StrictParseError(posB, msgsB);
        expect(ParseError.equal(errA, errB)).to.be.false;
        expect(ParseError.equal(errB, errA)).to.be.false;
      }
      // lazy
      {
        const errA = new LazyParseError(() => new StrictParseError(posA, msgsA));
        const errB = new LazyParseError(() => new StrictParseError(posB, msgsB));
        expect(ParseError.equal(errA, errB)).to.be.false;
        expect(ParseError.equal(errB, errA)).to.be.false;
      }
      // mixed
      {
        const errA = new StrictParseError(posA, msgsA);
        const errB = new LazyParseError(() => new StrictParseError(posB, msgsB));
        expect(ParseError.equal(errA, errB)).to.be.false;
        expect(ParseError.equal(errB, errA)).to.be.false;
      }
    }
    // different error messages
    {
      const posA = new SourcePos("main", 496, 6, 28);
      const msgsA = [
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
      ];
      const posB = new SourcePos("main", 496, 6, 28);
      const msgsB = [
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "x"),
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "y"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "z"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "w"),
      ];
      // strict
      {
        const errA = new StrictParseError(posA, msgsA);
        const errB = new StrictParseError(posB, msgsB);
        expect(ParseError.equal(errA, errB)).to.be.false;
        expect(ParseError.equal(errB, errA)).to.be.false;
      }
      // lazy
      {
        const errA = new LazyParseError(() => new StrictParseError(posA, msgsA));
        const errB = new LazyParseError(() => new StrictParseError(posB, msgsB));
        expect(ParseError.equal(errA, errB)).to.be.false;
        expect(ParseError.equal(errB, errA)).to.be.false;
      }
      // mixed
      {
        const errA = new StrictParseError(posA, msgsA);
        const errB = new LazyParseError(() => new StrictParseError(posB, msgsB));
        expect(ParseError.equal(errA, errB)).to.be.false;
        expect(ParseError.equal(errB, errA)).to.be.false;
        expect(ParseError.equal(errB, errA)).to.be.false;
      }
    }
    // both
    {
      const posA = new SourcePos("main", 496, 6, 28);
      const msgsA = [
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
      ];
      const posB = new SourcePos("lib", 497, 7, 29);
      const msgsB = [
        ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "x"),
        ErrorMessage.create(ErrorMessageType.UNEXPECT, "y"),
        ErrorMessage.create(ErrorMessageType.EXPECT, "z"),
        ErrorMessage.create(ErrorMessageType.MESSAGE, "w"),
      ];
      // strict
      {
        const errA = new StrictParseError(posA, msgsA);
        const errB = new StrictParseError(posB, msgsB);
        expect(ParseError.equal(errA, errB)).to.be.false;
        expect(ParseError.equal(errB, errA)).to.be.false;
      }
      // lazy
      {
        const errA = new LazyParseError(() => new StrictParseError(posA, msgsA));
        const errB = new LazyParseError(() => new StrictParseError(posB, msgsB));
        expect(ParseError.equal(errA, errB)).to.be.false;
        expect(ParseError.equal(errB, errA)).to.be.false;
      }
      // mixed
      {
        const errA = new StrictParseError(posA, msgsA);
        const errB = new LazyParseError(() => new StrictParseError(posB, msgsB));
        expect(ParseError.equal(errA, errB)).to.be.false;
        expect(ParseError.equal(errB, errA)).to.be.false;
      }
    }
  });
});

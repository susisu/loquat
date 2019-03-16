"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, ParseError, LazyParseError } = _error;

describe(".equal", () => {
  it("should return `true` if two errors describe equal", () => {
    const posA = new SourcePos("main", 6, 28);
    const msgsA = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
      new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
    ];
    const posB = new SourcePos("main", 6, 28);
    const msgsB = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
      new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
    ];
    // strict
    {
      const errA = new ParseError(posA, msgsA);
      const errB = new ParseError(posB, msgsB);
      expect(ParseError.equal(errA, errB)).to.be.true;
    }
    // lazy
    {
      const errA = new LazyParseError(() => new ParseError(posA, msgsA));
      const errB = new LazyParseError(() => new ParseError(posB, msgsB));
      expect(ParseError.equal(errA, errB)).to.be.true;
    }
    // mixed
    {
      const errA = new ParseError(posA, msgsA);
      const errB = new LazyParseError(() => new ParseError(posB, msgsB));
      expect(ParseError.equal(errA, errB)).to.be.true;
      expect(ParseError.equal(errB, errA)).to.be.true;
    }
  });

  it("should return `false` if two errors describe different", () => {
    // different position
    {
      const posA = new SourcePos("main", 6, 28);
      const msgsA = [
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
        new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
        new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
      ];
      const posB = new SourcePos("main", 7, 28);
      const msgsB = [
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
        new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
        new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
      ];
      // strict
      {
        const errA = new ParseError(posA, msgsA);
        const errB = new ParseError(posB, msgsB);
        expect(ParseError.equal(errA, errB)).to.be.false;
      }
      // lazy
      {
        const errA = new LazyParseError(() => new ParseError(posA, msgsA));
        const errB = new LazyParseError(() => new ParseError(posB, msgsB));
        expect(ParseError.equal(errA, errB)).to.be.false;
      }
      // mixed
      {
        const errA = new ParseError(posA, msgsA);
        const errB = new LazyParseError(() => new ParseError(posB, msgsB));
        expect(ParseError.equal(errA, errB)).to.be.false;
        expect(ParseError.equal(errB, errA)).to.be.false;
      }
    }
    // different error messages
    {
      const posA = new SourcePos("main", 6, 28);
      const msgsA = [
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
        new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
        new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
      ];
      const posB = new SourcePos("main", 6, 28);
      const msgsB = [
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
        new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
        new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "ABC"),
      ];
      // strict
      {
        const errA = new ParseError(posA, msgsA);
        const errB = new ParseError(posB, msgsB);
        expect(ParseError.equal(errA, errB)).to.be.false;
      }
      // lazy
      {
        const errA = new LazyParseError(() => new ParseError(posA, msgsA));
        const errB = new LazyParseError(() => new ParseError(posB, msgsB));
        expect(ParseError.equal(errA, errB)).to.be.false;
      }
      // mixed
      {
        const errA = new ParseError(posA, msgsA);
        const errB = new LazyParseError(() => new ParseError(posB, msgsB));
        expect(ParseError.equal(errA, errB)).to.be.false;
        expect(ParseError.equal(errB, errA)).to.be.false;
      }
    }
    // both
    {
      const posA = new SourcePos("main", 6, 28);
      const msgsA = [
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
        new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
        new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
      ];
      const posB = new SourcePos("main", 7, 28);
      const msgsB = [
        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
        new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
        new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
        new ErrorMessage(ErrorMessageType.MESSAGE, "ABC"),
      ];
      // strict
      {
        const errA = new ParseError(posA, msgsA);
        const errB = new ParseError(posB, msgsB);
        expect(ParseError.equal(errA, errB)).to.be.false;
      }
      // lazy
      {
        const errA = new LazyParseError(() => new ParseError(posA, msgsA));
        const errB = new LazyParseError(() => new ParseError(posB, msgsB));
        expect(ParseError.equal(errA, errB)).to.be.false;
      }
      // mixed
      {
        const errA = new ParseError(posA, msgsA);
        const errB = new LazyParseError(() => new ParseError(posB, msgsB));
        expect(ParseError.equal(errA, errB)).to.be.false;
        expect(ParseError.equal(errB, errA)).to.be.false;
      }
    }
  });
});

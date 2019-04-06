"use strict";

const { expect } = require("chai");

const { SourcePos } = $pos;
const { ErrorMessageType, ErrorMessage, ParseError, StrictParseError, LazyParseError } = $error;

describe(".merge", () => {
  it("should return a parse error equal to the first argument if the second is unknown but the"
    + " first is not", () => {
    const posA = new SourcePos("main", 496, 6, 28);
    const msgsA = [
      ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
      ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
      ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
    ];
    const posB = new SourcePos("main", 506, 7, 29);
    const msgsB = [];
    // strict
    {
      const errA = new StrictParseError(posA, msgsA);
      const errB = new StrictParseError(posB, msgsB);
      const err = ParseError.merge(errA, errB);
      expect(ParseError.equal(err, new StrictParseError(posA, msgsA))).to.be.true;
    }
    // lazy
    {
      const errA = new LazyParseError(() => new StrictParseError(posA, msgsA));
      const errB = new LazyParseError(() => new StrictParseError(posB, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(ParseError.equal(err, new StrictParseError(posA, msgsA))).to.be.true;
    }
    // mixed
    {
      const errA = new LazyParseError(() => new StrictParseError(posA, msgsA));
      const errB = new StrictParseError(posB, msgsB);
      const err = ParseError.merge(errA, errB);
      expect(ParseError.equal(err, new StrictParseError(posA, msgsA))).to.be.true;
    }
    {
      const errA = new StrictParseError(posA, msgsA);
      const errB = new LazyParseError(() => new StrictParseError(posB, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(ParseError.equal(err, new StrictParseError(posA, msgsA))).to.be.true;
    }
  });

  it("should return a parse error equal to the second argument if the first is unknown but the"
    + " second is not", () => {
    const posA = new SourcePos("main", 506, 7, 29);
    const msgsA = [];
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
      const err = ParseError.merge(errA, errB);
      expect(ParseError.equal(err, new StrictParseError(posB, msgsB))).to.be.true;
    }
    // lazy
    {
      const errA = new LazyParseError(() => new StrictParseError(posA, msgsA));
      const errB = new LazyParseError(() => new StrictParseError(posB, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(ParseError.equal(err, new StrictParseError(posB, msgsB))).to.be.true;
    }
    // mixed
    {
      const errA = new LazyParseError(() => new StrictParseError(posA, msgsA));
      const errB = new StrictParseError(posB, msgsB);
      const err = ParseError.merge(errA, errB);
      expect(ParseError.equal(err, new StrictParseError(posB, msgsB))).to.be.true;
    }
    {
      const errA = new StrictParseError(posA, msgsA);
      const errB = new LazyParseError(() => new StrictParseError(posB, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(ParseError.equal(err, new StrictParseError(posB, msgsB))).to.be.true;
    }
  });

  it("should return a parse error equal to the first element if its position is behind that of the"
    + " second", () => {
    const posA = new SourcePos("main", 506, 7, 29);
    const msgsA = [
      ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
      ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
      ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
    ];
    const posB = new SourcePos("main", 496, 6, 28);
    const msgsB = [
      ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "A"),
      ErrorMessage.create(ErrorMessageType.UNEXPECT, "B"),
      ErrorMessage.create(ErrorMessageType.EXPECT, "C"),
      ErrorMessage.create(ErrorMessageType.MESSAGE, "D"),
    ];
    // strict
    {
      const errA = new StrictParseError(posA, msgsA);
      const errB = new StrictParseError(posB, msgsB);
      const err = ParseError.merge(errA, errB);
      expect(ParseError.equal(err, new StrictParseError(posA, msgsA))).to.be.true;
    }
    // lazy
    {
      const errA = new LazyParseError(() => new StrictParseError(posA, msgsA));
      const errB = new LazyParseError(() => new StrictParseError(posB, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(ParseError.equal(err, new StrictParseError(posA, msgsA))).to.be.true;
    }
    // mixed
    {
      const errA = new LazyParseError(() => new StrictParseError(posA, msgsA));
      const errB = new StrictParseError(posB, msgsB);
      const err = ParseError.merge(errA, errB);
      expect(ParseError.equal(err, new StrictParseError(posA, msgsA))).to.be.true;
    }
    {
      const errA = new StrictParseError(posA, msgsA);
      const errB = new LazyParseError(() => new StrictParseError(posB, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(ParseError.equal(err, new StrictParseError(posA, msgsA))).to.be.true;
    }
  });

  it("should return a parse error equal to the second element if its position is behind that of the"
        + " first", () => {
    const posA = new SourcePos("main", 496, 6, 28);
    const msgsA = [
      ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
      ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
      ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
    ];
    const posB = new SourcePos("main", 506, 7, 29);
    const msgsB = [
      ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "A"),
      ErrorMessage.create(ErrorMessageType.UNEXPECT, "B"),
      ErrorMessage.create(ErrorMessageType.EXPECT, "C"),
      ErrorMessage.create(ErrorMessageType.MESSAGE, "D"),
    ];
    // strict
    {
      const errA = new StrictParseError(posA, msgsA);
      const errB = new StrictParseError(posB, msgsB);
      const err = ParseError.merge(errA, errB);
      expect(ParseError.equal(err, new StrictParseError(posB, msgsB))).to.be.true;
    }
    // lazy
    {
      const errA = new LazyParseError(() => new StrictParseError(posA, msgsA));
      const errB = new LazyParseError(() => new StrictParseError(posB, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(ParseError.equal(err, new StrictParseError(posB, msgsB))).to.be.true;
    }
    // mixed
    {
      const errA = new LazyParseError(() => new StrictParseError(posA, msgsA));
      const errB = new StrictParseError(posB, msgsB);
      const err = ParseError.merge(errA, errB);
      expect(ParseError.equal(err, new StrictParseError(posB, msgsB))).to.be.true;
    }
    {
      const errA = new StrictParseError(posA, msgsA);
      const errB = new LazyParseError(() => new StrictParseError(posB, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(ParseError.equal(err, new StrictParseError(posB, msgsB))).to.be.true;
    }
  });

  it("should return a parse error with the messages of the arguments concatenated if their"
    + " positions are equal", () => {
    const pos = new SourcePos("foobar", 496, 6, 28);
    const msgsA = [
      ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      ErrorMessage.create(ErrorMessageType.UNEXPECT, "bar"),
      ErrorMessage.create(ErrorMessageType.EXPECT, "baz"),
      ErrorMessage.create(ErrorMessageType.MESSAGE, "qux"),
    ];
    const msgsB = [
      ErrorMessage.create(ErrorMessageType.SYSTEM_UNEXPECT, "A"),
      ErrorMessage.create(ErrorMessageType.UNEXPECT, "B"),
      ErrorMessage.create(ErrorMessageType.EXPECT, "C"),
      ErrorMessage.create(ErrorMessageType.MESSAGE, "D"),
    ];
    const msgs = msgsA.concat(msgsB);
    // strict
    {
      const errA = new StrictParseError(pos, msgsA);
      const errB = new StrictParseError(pos, msgsB);
      const err = ParseError.merge(errA, errB);
      expect(ParseError.equal(err, new StrictParseError(pos, msgs))).to.be.true;
    }
    // lazy
    {
      const errA = new LazyParseError(() => new StrictParseError(pos, msgsA));
      const errB = new LazyParseError(() => new StrictParseError(pos, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(ParseError.equal(err, new StrictParseError(pos, msgs))).to.be.true;
    }
    // mixed
    {
      const errA = new LazyParseError(() => new StrictParseError(pos, msgsA));
      const errB = new StrictParseError(pos, msgsB);
      const err = ParseError.merge(errA, errB);
      expect(ParseError.equal(err, new StrictParseError(pos, msgs))).to.be.true;
    }
    {
      const errA = new StrictParseError(pos, msgsA);
      const errB = new LazyParseError(() => new StrictParseError(pos, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(ParseError.equal(err, new StrictParseError(pos, msgs))).to.be.true;
    }
  });
});

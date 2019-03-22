"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { ErrorMessageType, ErrorMessage, AbstractParseError, ParseError, LazyParseError } = _error;

describe(".merge", () => {
  it("should return a parse error equal to the first argument if the second is unknown but the"
    + " first is not", () => {
    const posA = new SourcePos("main", 6, 28);
    const msgsA = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
      new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
    ];
    const posB = new SourcePos("main", 7, 28);
    const msgsB = [];
    // strict
    {
      const errA = new ParseError(posA, msgsA);
      const errB = new ParseError(posB, msgsB);
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posA);
      expect(err.msgs).to.be.equalErrorMessagesTo(msgsA);
    }
    // lazy
    {
      const errA = new LazyParseError(() => new ParseError(posA, msgsA));
      const errB = new LazyParseError(() => new ParseError(posB, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posA);
      expect(err.msgs).to.be.equalErrorMessagesTo(msgsA);
    }
    // mixed
    {
      const errA = new LazyParseError(() => new ParseError(posA, msgsA));
      const errB = new ParseError(posB, msgsB);
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posA);
      expect(err.msgs).to.be.equalErrorMessagesTo(msgsA);
    }
    {
      const errA = new ParseError(posA, msgsA);
      const errB = new LazyParseError(() => new ParseError(posB, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posA);
      expect(err.msgs).to.be.equalErrorMessagesTo(msgsA);
    }
  });

  it("should return a parse error equal to the second argument if the first is unknown but the"
    + " second is not", () => {
    const posA = new SourcePos("main", 7, 28);
    const msgsA = [];
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
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posB);
      expect(err.msgs).to.be.equalErrorMessagesTo(msgsB);
    }
    // lazy
    {
      const errA = new LazyParseError(() => new ParseError(posA, msgsA));
      const errB = new LazyParseError(() => new ParseError(posB, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posB);
      expect(err.msgs).to.be.equalErrorMessagesTo(msgsB);
    }
    // mixed
    {
      const errA = new LazyParseError(() => new ParseError(posA, msgsA));
      const errB = new ParseError(posB, msgsB);
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posB);
      expect(err.msgs).to.be.equalErrorMessagesTo(msgsB);
    }
    {
      const errA = new ParseError(posA, msgsA);
      const errB = new LazyParseError(() => new ParseError(posB, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posB);
      expect(err.msgs).to.be.equalErrorMessagesTo(msgsB);
    }
  });

  it("should return a parse error equal to the first element if its position is behind that of the"
    + " second", () => {
    const posA = new SourcePos("main", 7, 28);
    const msgsA = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
      new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
    ];
    const posB = new SourcePos("main", 6, 28);
    const msgsB = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "A"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "B"),
      new ErrorMessage(ErrorMessageType.EXPECT, "C"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "D"),
    ];
    // strict
    {
      const errA = new ParseError(posA, msgsA);
      const errB = new ParseError(posB, msgsB);
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posA);
      expect(err.msgs).to.be.equalErrorMessagesTo(msgsA);
    }
    // lazy
    {
      const errA = new LazyParseError(() => new ParseError(posA, msgsA));
      const errB = new LazyParseError(() => new ParseError(posB, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posA);
      expect(err.msgs).to.be.equalErrorMessagesTo(msgsA);
    }
    // mixed
    {
      const errA = new LazyParseError(() => new ParseError(posA, msgsA));
      const errB = new ParseError(posB, msgsB);
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posA);
      expect(err.msgs).to.be.equalErrorMessagesTo(msgsA);
    }
    {
      const errA = new ParseError(posA, msgsA);
      const errB = new LazyParseError(() => new ParseError(posB, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posA);
      expect(err.msgs).to.be.equalErrorMessagesTo(msgsA);
    }
  });

  it("should return a parse error equal to the second element if its position is behind that of the"
        + " first", () => {
    const posA = new SourcePos("main", 6, 28);
    const msgsA = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
      new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
    ];
    const posB = new SourcePos("main", 7, 28);
    const msgsB = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "A"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "B"),
      new ErrorMessage(ErrorMessageType.EXPECT, "C"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "D"),
    ];
    // strict
    {
      const errA = new ParseError(posA, msgsA);
      const errB = new ParseError(posB, msgsB);
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posB);
      expect(err.msgs).to.be.equalErrorMessagesTo(msgsB);
    }
    // lazy
    {
      const errA = new LazyParseError(() => new ParseError(posA, msgsA));
      const errB = new LazyParseError(() => new ParseError(posB, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posB);
      expect(err.msgs).to.be.equalErrorMessagesTo(msgsB);
    }
    // mixed
    {
      const errA = new LazyParseError(() => new ParseError(posA, msgsA));
      const errB = new ParseError(posB, msgsB);
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posB);
      expect(err.msgs).to.be.equalErrorMessagesTo(msgsB);
    }
    {
      const errA = new ParseError(posA, msgsA);
      const errB = new LazyParseError(() => new ParseError(posB, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posB);
      expect(err.msgs).to.be.equalErrorMessagesTo(msgsB);
    }
  });

  it("should return a parse error with the messages of the arguments concatenated if their"
    + " positions are equal", () => {
    const pos = new SourcePos("foobar", 6, 28);
    const msgsA = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
      new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "qux"),
    ];
    const msgsB = [
      new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "A"),
      new ErrorMessage(ErrorMessageType.UNEXPECT, "B"),
      new ErrorMessage(ErrorMessageType.EXPECT, "C"),
      new ErrorMessage(ErrorMessageType.MESSAGE, "D"),
    ];
    const msgs = msgsA.concat(msgsB);
    // strict
    {
      const errA = new ParseError(pos, msgsA);
      const errB = new ParseError(pos, msgsB);
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(pos);
      expect(err.msgs).to.be.equalErrorMessagesTo(msgs);
    }
    // lazy
    {
      const errA = new LazyParseError(() => new ParseError(pos, msgsA));
      const errB = new LazyParseError(() => new ParseError(pos, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(pos);
      expect(err.msgs).to.be.equalErrorMessagesTo(msgs);
    }
    // mixed
    {
      const errA = new LazyParseError(() => new ParseError(pos, msgsA));
      const errB = new ParseError(pos, msgsB);
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(pos);
      expect(err.msgs).to.be.equalErrorMessagesTo(msgs);
    }
    {
      const errA = new ParseError(pos, msgsA);
      const errB = new LazyParseError(() => new ParseError(pos, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(pos);
      expect(err.msgs).to.be.equalErrorMessagesTo(msgs);
    }
  });
});

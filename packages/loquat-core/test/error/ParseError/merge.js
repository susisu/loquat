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
      expect(ErrorMessage.messagesEqual(err.msgs, msgsA)).to.be.true;
    }
    // lazy
    {
      const errA = new LazyParseError(() => new ParseError(posA, msgsA));
      const errB = new LazyParseError(() => new ParseError(posB, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posA);
      expect(ErrorMessage.messagesEqual(err.msgs, msgsA)).to.be.true;
    }
    // mixed
    {
      const errA = new LazyParseError(() => new ParseError(posA, msgsA));
      const errB = new ParseError(posB, msgsB);
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posA);
      expect(ErrorMessage.messagesEqual(err.msgs, msgsA)).to.be.true;
    }
    {
      const errA = new ParseError(posA, msgsA);
      const errB = new LazyParseError(() => new ParseError(posB, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posA);
      expect(ErrorMessage.messagesEqual(err.msgs, msgsA)).to.be.true;
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
      expect(ErrorMessage.messagesEqual(err.msgs, msgsB)).to.be.true;
    }
    // lazy
    {
      const errA = new LazyParseError(() => new ParseError(posA, msgsA));
      const errB = new LazyParseError(() => new ParseError(posB, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posB);
      expect(ErrorMessage.messagesEqual(err.msgs, msgsB)).to.be.true;
    }
    // mixed
    {
      const errA = new LazyParseError(() => new ParseError(posA, msgsA));
      const errB = new ParseError(posB, msgsB);
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posB);
      expect(ErrorMessage.messagesEqual(err.msgs, msgsB)).to.be.true;
    }
    {
      const errA = new ParseError(posA, msgsA);
      const errB = new LazyParseError(() => new ParseError(posB, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posB);
      expect(ErrorMessage.messagesEqual(err.msgs, msgsB)).to.be.true;
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
      expect(ErrorMessage.messagesEqual(err.msgs, msgsA)).to.be.true;
    }
    // lazy
    {
      const errA = new LazyParseError(() => new ParseError(posA, msgsA));
      const errB = new LazyParseError(() => new ParseError(posB, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posA);
      expect(ErrorMessage.messagesEqual(err.msgs, msgsA)).to.be.true;
    }
    // mixed
    {
      const errA = new LazyParseError(() => new ParseError(posA, msgsA));
      const errB = new ParseError(posB, msgsB);
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posA);
      expect(ErrorMessage.messagesEqual(err.msgs, msgsA)).to.be.true;
    }
    {
      const errA = new ParseError(posA, msgsA);
      const errB = new LazyParseError(() => new ParseError(posB, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posA);
      expect(ErrorMessage.messagesEqual(err.msgs, msgsA)).to.be.true;
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
      expect(ErrorMessage.messagesEqual(err.msgs, msgsB)).to.be.true;
    }
    // lazy
    {
      const errA = new LazyParseError(() => new ParseError(posA, msgsA));
      const errB = new LazyParseError(() => new ParseError(posB, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posB);
      expect(ErrorMessage.messagesEqual(err.msgs, msgsB)).to.be.true;
    }
    // mixed
    {
      const errA = new LazyParseError(() => new ParseError(posA, msgsA));
      const errB = new ParseError(posB, msgsB);
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posB);
      expect(ErrorMessage.messagesEqual(err.msgs, msgsB)).to.be.true;
    }
    {
      const errA = new ParseError(posA, msgsA);
      const errB = new LazyParseError(() => new ParseError(posB, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(posB);
      expect(ErrorMessage.messagesEqual(err.msgs, msgsB)).to.be.true;
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
      expect(ErrorMessage.messagesEqual(err.msgs, msgs)).to.be.true;
    }
    // lazy
    {
      const errA = new LazyParseError(() => new ParseError(pos, msgsA));
      const errB = new LazyParseError(() => new ParseError(pos, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(pos);
      expect(ErrorMessage.messagesEqual(err.msgs, msgs)).to.be.true;
    }
    // mixed
    {
      const errA = new LazyParseError(() => new ParseError(pos, msgsA));
      const errB = new ParseError(pos, msgsB);
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(pos);
      expect(ErrorMessage.messagesEqual(err.msgs, msgs)).to.be.true;
    }
    {
      const errA = new ParseError(pos, msgsA);
      const errB = new LazyParseError(() => new ParseError(pos, msgsB));
      const err = ParseError.merge(errA, errB);
      expect(err).to.be.an.instanceOf(AbstractParseError);
      expect(err.pos).to.be.an.equalPositionTo(pos);
      expect(ErrorMessage.messagesEqual(err.msgs, msgs)).to.be.true;
    }
  });
});

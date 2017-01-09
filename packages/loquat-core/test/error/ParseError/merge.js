/*
 * loquat-core test / error.ParseError.merge()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos = _pos.SourcePos;

const ErrorMessageType   = _error.ErrorMessageType;
const ErrorMessage       = _error.ErrorMessage;
const ParseError         = _error.ParseError;
const LazyParseError     = _error.LazyParseError;

describe(".merge(errA, errB)", () => {
    it("should return an `AbstractParseError' object that is equal to `errA'"
        + " if `errB' is unknown but `errA' is not", () => {
        const posA = new SourcePos("foobar", 496, 28);
        const msgsA = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
        ];
        const posB = new SourcePos("foobar", 6, 28);
        const msgsB = [];
        // strict
        {
            const errA = new ParseError(posA, msgsA);
            const errB = new ParseError(posB, msgsB);
            const err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posA)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsA)).to.be.true;
        }
        // lazy
        {
            const errA = new LazyParseError(() => new ParseError(posA, msgsA));
            const errB = new LazyParseError(() => new ParseError(posB, msgsB));
            const err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posA)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsA)).to.be.true;
        }
        // mixed
        {
            const errA = new LazyParseError(() => new ParseError(posA, msgsA));
            const errB = new ParseError(posB, msgsB);
            const err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posA)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsA)).to.be.true;
        }
        {
            const errA = new ParseError(posA, msgsA);
            const errB = new LazyParseError(() => new ParseError(posB, msgsB));
            const err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posA)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsA)).to.be.true;
        }
    });

    it("should return an `AbstractParseError' object that is equal to `errB'"
        + " if `errA' is unknown but `errB' is not", () => {
        const posA = new SourcePos("foobar", 496, 28);
        const msgsA = [];
        const posB = new SourcePos("foobar", 6, 28);
        const msgsB = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
        ];
        // strict
        {
            const errA = new ParseError(posA, msgsA);
            const errB = new ParseError(posB, msgsB);
            const err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posB)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsB)).to.be.true;
        }
        // lazy
        {
            const errA = new LazyParseError(() => new ParseError(posA, msgsA));
            const errB = new LazyParseError(() => new ParseError(posB, msgsB));
            const err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posB)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsB)).to.be.true;
        }
        // mixed
        {
            const errA = new LazyParseError(() => new ParseError(posA, msgsA));
            const errB = new ParseError(posB, msgsB);
            const err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posB)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsB)).to.be.true;
        }
        {
            const errA = new ParseError(posA, msgsA);
            const errB = new LazyParseError(() => new ParseError(posB, msgsB));
            const err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posB)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsB)).to.be.true;
        }
    });

    it("should return an `AbstractParseError' object that is equal to `errA'"
        + " if `errA.pos' is behind `errB.pos'", () => {
        const posA = new SourcePos("foobar", 496, 28);
        const msgsA = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
        ];
        const posB = new SourcePos("foobar", 6, 28);
        const msgsB = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "x"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "y"),
            new ErrorMessage(ErrorMessageType.EXPECT, "z"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "w")
        ];
        // strict
        {
            const errA = new ParseError(posA, msgsA);
            const errB = new ParseError(posB, msgsB);
            const err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posA)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsA)).to.be.true;
        }
        // lazy
        {
            const errA = new LazyParseError(() => new ParseError(posA, msgsA));
            const errB = new LazyParseError(() => new ParseError(posB, msgsB));
            const err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posA)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsA)).to.be.true;
        }
        // mixed
        {
            const errA = new LazyParseError(() => new ParseError(posA, msgsA));
            const errB = new ParseError(posB, msgsB);
            const err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posA)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsA)).to.be.true;
        }
        {
            const errA = new ParseError(posA, msgsA);
            const errB = new LazyParseError(() => new ParseError(posB, msgsB));
            const err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posA)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsA)).to.be.true;
        }
    });
    it("should return an `AbstractParseError' object that is equal to `errB'"
        + " if `errB.pos' is behind `errA.pos'", () => {
        const posA = new SourcePos("foobar", 6, 28);
        const msgsA = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
        ];
        const posB = new SourcePos("foobar", 496, 28);
        const msgsB = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "x"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "y"),
            new ErrorMessage(ErrorMessageType.EXPECT, "z"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "w")
        ];
        // strict
        {
            const errA = new ParseError(posA, msgsA);
            const errB = new ParseError(posB, msgsB);
            const err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posB)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsB)).to.be.true;
        }
        // lazy
        {
            const errA = new LazyParseError(() => new ParseError(posA, msgsA));
            const errB = new LazyParseError(() => new ParseError(posB, msgsB));
            const err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posB)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsB)).to.be.true;
        }
        // mixed
        {
            const errA = new LazyParseError(() => new ParseError(posA, msgsA));
            const errB = new ParseError(posB, msgsB);
            const err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posB)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsB)).to.be.true;
        }
        {
            const errA = new ParseError(posA, msgsA);
            const errB = new LazyParseError(() => new ParseError(posB, msgsB));
            const err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posB)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsB)).to.be.true;
        }
    });

    it("should return an `AbstractParseError' object with error messages of `errA' and `errB' concatenated"
        + " if `errA.pos' is equal to `errB.pos'", () => {
        const pos = new SourcePos("foobar", 496, 28);
        const msgsA = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
        ];
        const msgsB = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "x"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "y"),
            new ErrorMessage(ErrorMessageType.EXPECT, "z"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "w")
        ];
        const msgs = msgsA.concat(msgsB);
        // strict
        {
            const errA = new ParseError(pos, msgsA);
            const errB = new ParseError(pos, msgsB);
            const err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, pos)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgs)).to.be.true;
        }
        // lazy
        {
            const errA = new LazyParseError(() => new ParseError(pos, msgsA));
            const errB = new LazyParseError(() => new ParseError(pos, msgsB));
            const err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, pos)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgs)).to.be.true;
        }
        // mixed
        {
            const errA = new LazyParseError(() => new ParseError(pos, msgsA));
            const errB = new ParseError(pos, msgsB);
            const err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, pos)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgs)).to.be.true;
        }
        {
            const errA = new ParseError(pos, msgsA);
            const errB = new LazyParseError(() => new ParseError(pos, msgsB));
            const err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, pos)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgs)).to.be.true;
        }
    });
});

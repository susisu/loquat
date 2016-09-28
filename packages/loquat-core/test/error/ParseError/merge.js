/*
 * loquat-core test / error.ParseError.merge()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("pos.js");
const { ErrorMessageType, ErrorMessage, ParseError, LazyParseError } = require("error.js");

describe(".merge(errA, errB)", () => {
    it("should return an `AbstractParseError' object that is equal to `errA'"
        + " if `errB' is unknown but `errA' is not", () => {
        let posA = new SourcePos("foobar", 496, 28);
        let msgsA = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
        ];
        let posB = new SourcePos("foobar", 6, 28);
        let msgsB = [];
        // strict
        {
            let errA = new ParseError(posA, msgsA);
            let errB = new ParseError(posB, msgsB);
            let err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posA)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsA)).to.be.true;
        }
        // lazy
        {
            let errA = new LazyParseError(() => new ParseError(posA, msgsA));
            let errB = new LazyParseError(() => new ParseError(posB, msgsB));
            let err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posA)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsA)).to.be.true;
        }
        // mixed
        {
            let errA = new LazyParseError(() => new ParseError(posA, msgsA));
            let errB = new ParseError(posB, msgsB);
            let err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posA)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsA)).to.be.true;
        }
        {
            let errA = new ParseError(posA, msgsA);
            let errB = new LazyParseError(() => new ParseError(posB, msgsB));
            let err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posA)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsA)).to.be.true;
        }
    });

    it("should return an `AbstractParseError' object that is equal to `errB'"
        + " if `errA' is unknown but `errB' is not", () => {
        let posA = new SourcePos("foobar", 496, 28);
        let msgsA = [];
        let posB = new SourcePos("foobar", 6, 28);
        let msgsB = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
        ];
        // strict
        {
            let errA = new ParseError(posA, msgsA);
            let errB = new ParseError(posB, msgsB);
            let err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posB)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsB)).to.be.true;
        }
        // lazy
        {
            let errA = new LazyParseError(() => new ParseError(posA, msgsA));
            let errB = new LazyParseError(() => new ParseError(posB, msgsB));
            let err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posB)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsB)).to.be.true;
        }
        // mixed
        {
            let errA = new LazyParseError(() => new ParseError(posA, msgsA));
            let errB = new ParseError(posB, msgsB);
            let err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posB)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsB)).to.be.true;
        }
        {
            let errA = new ParseError(posA, msgsA);
            let errB = new LazyParseError(() => new ParseError(posB, msgsB));
            let err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posB)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsB)).to.be.true;
        }
    });

    it("should return an `AbstractParseError' object that is equal to `errA'"
        + " if `errA.pos' is behind `errB.pos'", () => {
        let posA = new SourcePos("foobar", 496, 28);
        let msgsA = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
        ];
        let posB = new SourcePos("foobar", 6, 28);
        let msgsB = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "x"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "y"),
            new ErrorMessage(ErrorMessageType.EXPECT, "z"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "w")
        ];
        // strict
        {
            let errA = new ParseError(posA, msgsA);
            let errB = new ParseError(posB, msgsB);
            let err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posA)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsA)).to.be.true;
        }
        // lazy
        {
            let errA = new LazyParseError(() => new ParseError(posA, msgsA));
            let errB = new LazyParseError(() => new ParseError(posB, msgsB));
            let err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posA)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsA)).to.be.true;
        }
        // mixed
        {
            let errA = new LazyParseError(() => new ParseError(posA, msgsA));
            let errB = new ParseError(posB, msgsB);
            let err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posA)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsA)).to.be.true;
        }
        {
            let errA = new ParseError(posA, msgsA);
            let errB = new LazyParseError(() => new ParseError(posB, msgsB));
            let err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posA)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsA)).to.be.true;
        }
    });
    it("should return an `AbstractParseError' object that is equal to `errB'"
        + " if `errB.pos' is behind `errA.pos'", () => {
        let posA = new SourcePos("foobar", 6, 28);
        let msgsA = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
        ];
        let posB = new SourcePos("foobar", 496, 28);
        let msgsB = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "x"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "y"),
            new ErrorMessage(ErrorMessageType.EXPECT, "z"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "w")
        ];
        // strict
        {
            let errA = new ParseError(posA, msgsA);
            let errB = new ParseError(posB, msgsB);
            let err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posB)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsB)).to.be.true;
        }
        // lazy
        {
            let errA = new LazyParseError(() => new ParseError(posA, msgsA));
            let errB = new LazyParseError(() => new ParseError(posB, msgsB));
            let err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posB)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsB)).to.be.true;
        }
        // mixed
        {
            let errA = new LazyParseError(() => new ParseError(posA, msgsA));
            let errB = new ParseError(posB, msgsB);
            let err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posB)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsB)).to.be.true;
        }
        {
            let errA = new ParseError(posA, msgsA);
            let errB = new LazyParseError(() => new ParseError(posB, msgsB));
            let err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, posB)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgsB)).to.be.true;
        }
    });

    it("should return an `AbstractParseError' object with error messages of `errA' and `errB' concatenated"
        + " if `errA.pos' is equal to `errB.pos'", () => {
        let pos = new SourcePos("foobar", 496, 28);
        let msgsA = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
        ];
        let msgsB = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "x"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "y"),
            new ErrorMessage(ErrorMessageType.EXPECT, "z"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "w")
        ];
        let msgs = msgsA.concat(msgsB);
        // strict
        {
            let errA = new ParseError(pos, msgsA);
            let errB = new ParseError(pos, msgsB);
            let err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, pos)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgs)).to.be.true;
        }
        // lazy
        {
            let errA = new LazyParseError(() => new ParseError(pos, msgsA));
            let errB = new LazyParseError(() => new ParseError(pos, msgsB));
            let err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, pos)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgs)).to.be.true;
        }
        // mixed
        {
            let errA = new LazyParseError(() => new ParseError(pos, msgsA));
            let errB = new ParseError(pos, msgsB);
            let err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, pos)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgs)).to.be.true;
        }
        {
            let errA = new ParseError(pos, msgsA);
            let errB = new LazyParseError(() => new ParseError(pos, msgsB));
            let err = ParseError.merge(errA, errB);
            expect(SourcePos.equal(err.pos, pos)).to.be.true;
            expect(ErrorMessage.messagesEqual(err.msgs, msgs)).to.be.true;
        }
    });
});

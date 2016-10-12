/*
 * loquat-core test / error.ParseError.equal()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos = _pos.SourcePos;

const ErrorMessageType   = _error.ErrorMessageType;
const ErrorMessage       = _error.ErrorMessage;
const ParseError         = _error.ParseError;
const LazyParseError     = _error.LazyParseError;

describe(".equal(errA, errB)", () => {
    it("should return `true' if two errors describe the same error", () => {
        let posA = new SourcePos("foobar", 496, 28);
        let msgsA = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
        ];
        let posB = new SourcePos("foobar", 496, 28);
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
            expect(ParseError.equal(errA, errB)).to.be.true;
        }
        // lazy
        {
            let errA = new LazyParseError(() => new ParseError(posA, msgsA));
            let errB = new LazyParseError(() => new ParseError(posB, msgsB));
            expect(ParseError.equal(errA, errB)).to.be.true;
        }
        // mixed
        {
            let errA = new ParseError(posA, msgsA);
            let errB = new LazyParseError(() => new ParseError(posB, msgsB));
            expect(ParseError.equal(errA, errB)).to.be.true;
            expect(ParseError.equal(errB, errA)).to.be.true;
        }
    });

    it("should return `false' if two errors describe different error", () => {
        // different position
        {
            let posA = new SourcePos("foobar", 496, 28);
            let msgsA = [
                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
                new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
                new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
                new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
            ];
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
                expect(ParseError.equal(errA, errB)).to.be.false;
            }
            // lazy
            {
                let errA = new LazyParseError(() => new ParseError(posA, msgsA));
                let errB = new LazyParseError(() => new ParseError(posB, msgsB));
                expect(ParseError.equal(errA, errB)).to.be.false;
            }
            // mixed
            {
                let errA = new ParseError(posA, msgsA);
                let errB = new LazyParseError(() => new ParseError(posB, msgsB));
                expect(ParseError.equal(errA, errB)).to.be.false;
                expect(ParseError.equal(errB, errA)).to.be.false;
            }
        }
        // different error messages
        {
            let posA = new SourcePos("foobar", 496, 28);
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
                expect(ParseError.equal(errA, errB)).to.be.false;
            }
            // lazy
            {
                let errA = new LazyParseError(() => new ParseError(posA, msgsA));
                let errB = new LazyParseError(() => new ParseError(posB, msgsB));
                expect(ParseError.equal(errA, errB)).to.be.false;
            }
            // mixed
            {
                let errA = new ParseError(posA, msgsA);
                let errB = new LazyParseError(() => new ParseError(posB, msgsB));
                expect(ParseError.equal(errA, errB)).to.be.false;
                expect(ParseError.equal(errB, errA)).to.be.false;
            }
        }
        // both
        {
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
                expect(ParseError.equal(errA, errB)).to.be.false;
            }
            // lazy
            {
                let errA = new LazyParseError(() => new ParseError(posA, msgsA));
                let errB = new LazyParseError(() => new ParseError(posB, msgsB));
                expect(ParseError.equal(errA, errB)).to.be.false;
            }
            // mixed
            {
                let errA = new ParseError(posA, msgsA);
                let errB = new LazyParseError(() => new ParseError(posB, msgsB));
                expect(ParseError.equal(errA, errB)).to.be.false;
                expect(ParseError.equal(errB, errA)).to.be.false;
            }
        }
    });
});

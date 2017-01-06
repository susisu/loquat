/*
 * loquat-core test / error.LazyParseError#eval()
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

describe("#eval()", () => {
    it("should evaluate the thunk then return a `ParseError` object obtained as a result and cahce it"
        + " if there is no cache", () => {
        const pos = new SourcePos("foobar", 496, 28);
        const msgs = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
        ];
        {
            const err = new LazyParseError(() => new ParseError(pos, msgs));
            const res = err.eval();
            expect(res).to.be.an.instanceOf(ParseError);
            expect(SourcePos.equal(res.pos, pos)).to.be.true;
            expect(ErrorMessage.messagesEqual(res.msgs, msgs)).to.be.true;
        }
        // a multiply-nested LazyParseError object is also evaluated to a ParseError object
        {
            const err = new LazyParseError(() =>
                new LazyParseError(() =>
                    new ParseError(pos, msgs)
                )
            );
            const res = err.eval();
            expect(res).to.be.an.instanceOf(ParseError);
            expect(SourcePos.equal(res.pos, pos)).to.be.true;
            expect(ErrorMessage.messagesEqual(res.msgs, msgs)).to.be.true;
        }
    });

    it("should return the cached result if it exists", () => {
        const pos = new SourcePos("foobar", 496, 28);
        const msgs = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
        ];
        {
            let evalCount = 0;
            const err = new LazyParseError(() => {
                evalCount += 1;
                return new ParseError(pos, msgs);
            });
            const resA = err.eval();
            const resB = err.eval();
            // the cached result is returned
            expect(evalCount).to.equal(1);
            expect(ParseError.equal(resA, resB)).to.be.true;
        }
        // all LazyParseError objects are evaluated only once
        {
            let intermediateEvalCount = 0;
            let evalCount = 0;
            const err = new LazyParseError(() => {
                evalCount += 1;
                return new LazyParseError(() => {
                    intermediateEvalCount += 1;
                    return new ParseError(pos, msgs);
                });
            });
            const resA = err.eval();
            const resB = err.eval();
            expect(intermediateEvalCount).to.equal(1);
            expect(evalCount).to.equal(1);
            expect(ParseError.equal(resA, resB)).to.be.true;
        }
        {
            let intermediateEvalCount = 0;
            const intermediateErr = new LazyParseError(() => {
                intermediateEvalCount += 1;
                return new ParseError(pos, msgs);
            });
            let evalCount = 0;
            const err = new LazyParseError(() => {
                evalCount += 1;
                return intermediateErr;
            });
            // evaluate intermediate one first
            const intermediateRes = intermediateErr.eval();
            const resA = err.eval();
            const resB = err.eval();
            expect(intermediateEvalCount).to.equal(1);
            expect(evalCount).to.equal(1);
            expect(ParseError.equal(resA, resB)).to.be.true;
            expect(ParseError.equal(resA, intermediateRes)).to.be.true;
        }
    });

    it("should throw a `TypeError' if invalid thunk (not a function) found in the evaluation", () => {
        const invalidThunks = [
            null,
            undefined,
            "foobar",
            496,
            true,
            {}
        ];
        for (const thunk of invalidThunks) {
            {
                const err = new LazyParseError(thunk);
                expect(() => { err.eval(); }).to.throw(TypeError);
            }
            {
                const err = new LazyParseError(() => new LazyParseError(thunk));
                expect(() => { err.eval(); }).to.throw(TypeError);
            }
        }
    });

    it("should throw a `TypeError' if the final evaluation result is not a `ParseError' object", () => {
        const invalidResults = [
            null,
            undefined,
            "foobar",
            496,
            true,
            {},
            () => {}
        ];
        for (const res of invalidResults) {
            {
                const err = new LazyParseError(() => res);
                expect(() => { err.eval(); }).to.throw(TypeError);
            }
            {
                const err = new LazyParseError(() => new LazyParseError(() => res));
                expect(() => { err.eval(); }).to.throw(TypeError);
            }
        }
    });
});

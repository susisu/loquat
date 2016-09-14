/*
 * loquat-core test / error.LazyParseError#eval()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("pos.js");
const { ErrorMessageType, ErrorMessage, ParseError, LazyParseError } = require("error.js");

describe("#eval()", () => {
    it("should evaluate the thunk then return a `ParseError` object obtained as a result and cahce it"
        + " if there is no cache", () => {
        let pos = new SourcePos("foobar", 496, 28);
        let msgs = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
        ];
        {
            let err = new LazyParseError(() => new ParseError(pos, msgs));
            let res = err.eval();
            expect(res).to.be.an.instanceOf(ParseError);
            expect(SourcePos.equal(res.pos, pos)).to.be.true;
            expect(ErrorMessage.messagesEqual(res.msgs, msgs)).to.be.true;
        }
        // a multiply-nested LazyParseError object is also evaluated to a ParseError object
        {
            let err = new LazyParseError(() =>
                new LazyParseError(() =>
                    new ParseError(pos, msgs)
                )
            );
            let res = err.eval();
            expect(res).to.be.an.instanceOf(ParseError);
            expect(SourcePos.equal(res.pos, pos)).to.be.true;
            expect(ErrorMessage.messagesEqual(res.msgs, msgs)).to.be.true;
        }
    });

    it("should return the cached result if it exists", () => {
        let pos = new SourcePos("foobar", 496, 28);
        let msgs = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
        ];
        {
            let evalCount = 0;
            let err = new LazyParseError(() => {
                evalCount += 1;
                return new ParseError(pos, msgs)
            });
            let resA = err.eval();
            let resB = err.eval();
            // the cached result is returned
            expect(evalCount).to.equal(1);
            expect(ParseError.equal(resA, resB)).to.be.true;
        }
        // all LazyParseError objects are evaluated only once
        {
            let intermediateEvalCount = 0;
            let evalCount = 0;
            let err = new LazyParseError(() => {
                evalCount += 1;
                return new LazyParseError(() => {
                    intermediateEvalCount += 1;
                    return new ParseError(pos, msgs)
                });
            });
            let resA = err.eval();
            let resB = err.eval();
            expect(intermediateEvalCount).to.equal(1);
            expect(evalCount).to.equal(1);
            expect(ParseError.equal(resA, resB)).to.be.true;
        }
    });

    it("should throw a `TypeError' if invalid thunk (not a function) found in the evaluation", () => {
        let invalidThunks = [
            null,
            undefined,
            "foobar",
            496,
            true,
            {}
        ];
        for (let thunk of invalidThunks) {
            {
                let err = new LazyParseError(thunk);
                expect(() => { err.eval(); }).to.throw(TypeError);
            }
            {
                let err = new LazyParseError(() => new LazyParseError(thunk));
                expect(() => { err.eval(); }).to.throw(TypeError);
            }
        }
    });

    it("should throw a `TypeError' if the final evaluation result is not a `ParseError' object", () => {
        let invalidResults = [
            null,
            undefined,
            "foobar",
            496,
            true,
            {},
            () => {}
        ];
        for (let res of invalidResults) {
            {
                let err = new LazyParseError(() => res);
                expect(() => { err.eval(); }).to.throw(TypeError);
            }
            {
                let err = new LazyParseError(() => new LazyParseError(() => res));
                expect(() => { err.eval(); }).to.throw(TypeError);
            }
        }
    });
});

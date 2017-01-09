/*
 * loquat-core test / error.LazyParseError#isUnknown()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos = _pos.SourcePos;

const ErrorMessageType   = _error.ErrorMessageType;
const ErrorMessage       = _error.ErrorMessage;
const ParseError         = _error.ParseError;
const LazyParseError     = _error.LazyParseError;

describe("#isUnknown()", () => {
    it("should first evaluate the thunk return `true' if the error messages list is empty", () => {
        const pos = new SourcePos("foobar", 496, 28);
        let evaluated = false;
        const err = new LazyParseError(() => {
            evaluated = true;
            return new ParseError(pos, []);
        });
        expect(err.isUnknown()).to.be.true;
        expect(evaluated).to.be.true;
    });

    it("should first evaluate the thunk return `false' if the error messages list is not empty", () => {
        const pos = new SourcePos("foobar", 496, 28);
        const msgs = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
        ];
        let evaluated = false;
        const err = new LazyParseError(() => {
            evaluated = true;
            return new ParseError(pos, msgs);
        });
        expect(err.isUnknown()).to.be.false;
        expect(evaluated).to.be.true;
    });
});

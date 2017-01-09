/*
 * loquat-core test / error.LazyParseError#pos
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos = _pos.SourcePos;

const ErrorMessageType   = _error.ErrorMessageType;
const ErrorMessage       = _error.ErrorMessage;
const ParseError         = _error.ParseError;
const LazyParseError     = _error.LazyParseError;

describe("#pos", () => {
    it("should first evaluate the thunk and return `pos' of the result", () => {
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
        expect(SourcePos.equal(err.pos, pos)).to.be.true;
        expect(evaluated).to.be.true;
    });
});

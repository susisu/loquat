/*
 * loquat-core test / error.ParseError.unknown()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos = _pos.SourcePos;

const ErrorMessage = _error.ErrorMessage;
const ParseError   = _error.ParseError;

describe(".unknown(pos)", () => {
    it("should create a new `ParseError' object describing unknown error (with empty error messages)", () => {
        const pos = new SourcePos("foobar", 496, 28);
        const err = ParseError.unknown(pos);
        expect(err).to.be.an.instanceOf(ParseError);
        expect(SourcePos.equal(err.pos, pos)).to.be.true;
        expect(ErrorMessage.messagesEqual(err.msgs, [])).to.be.true;
    });
});

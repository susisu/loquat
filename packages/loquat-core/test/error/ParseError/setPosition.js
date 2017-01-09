/*
 * loquat-core test / error.ParseError#setPosition()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos = _pos.SourcePos;

const ErrorMessageType   = _error.ErrorMessageType;
const ErrorMessage       = _error.ErrorMessage;
const ParseError         = _error.ParseError;

describe("#setPosition(pos)", () => {
    it("should return an `AbstractParseError' object with the specified position `pos'", () => {
        const pos = new SourcePos("foobar", 496, 28);
        const msgs = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "x"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "y"),
            new ErrorMessage(ErrorMessageType.EXPECT, "z"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "w")
        ];
        const err = new ParseError(pos, msgs);
        const newPos = new SourcePos("nyancat", 128, 256);
        const newErr = err.setPosition(newPos);
        expect(SourcePos.equal(newErr.pos, newPos)).to.be.true;
        expect(ErrorMessage.messagesEqual(newErr.msgs, msgs)).to.be.true;
    });
});

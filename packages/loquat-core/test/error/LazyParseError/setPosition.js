/*
 * loquat-core test / error.LazyParseError#setPosition()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const _pos = require("pos.js");
const SourcePos = _pos.SourcePos;

const _error = require("error.js");
const ErrorMessageType   = _error.ErrorMessageType;
const ErrorMessage       = _error.ErrorMessage;
const ParseError         = _error.ParseError;
const LazyParseError     = _error.LazyParseError;

describe("#setPosition(pos)", () => {
    it("should return an `AbstractParseError' object with the specified position `pos'", () => {
        let pos = new SourcePos("foobar", 496, 28);
        let msgs = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "x"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "y"),
            new ErrorMessage(ErrorMessageType.EXPECT, "z"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "w")
        ];
        let evaluated = false;
        let err = new LazyParseError(() => {
            evaluated = true;
            return new ParseError(pos, msgs);
        });
        let newPos = new SourcePos("nyancat", 128, 256);
        let newErr = err.setPosition(newPos);
        // not evaluated yet
        expect(evaluated).to.be.false;
        expect(SourcePos.equal(newErr.pos, newPos)).to.be.true;
        expect(ErrorMessage.messagesEqual(newErr.msgs, msgs)).to.be.true;
        expect(evaluated).to.be.true;
    });
});

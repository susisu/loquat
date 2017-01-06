/*
 * loquat-core test / error.LazyParseError#setSpecificTypeMessages()
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

describe("#setSpecificTypeMessages(type, msgStrs)", () => {
    it("should return an `AbstractParseError' object with all the messages of the specified `type' removed"
        + " and new messages given by `msgStrs' added to the tail of the messages", () => {
        const pos = new SourcePos("foobar", 496, 28);
        const msgs = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "x"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "y"),
            new ErrorMessage(ErrorMessageType.EXPECT, "z"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "w")
        ];
        let evaluated = false;
        const err = new LazyParseError(() => {
            evaluated = true;
            return new ParseError(pos, msgs);
        });
        const newErr = err.setSpecificTypeMessages(ErrorMessageType.UNEXPECT, ["nyan", "cat"]);
        // not evaluated yet
        expect(evaluated).to.be.false;
        expect(SourcePos.equal(newErr.pos, pos)).to.be.true;
        expect(ErrorMessage.messagesEqual(newErr.msgs, [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "x"),
            new ErrorMessage(ErrorMessageType.EXPECT, "z"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "w"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "nyan"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "cat")
        ])).to.be.true;
        expect(evaluated).to.be.true;
    });
});

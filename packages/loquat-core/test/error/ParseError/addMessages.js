/*
 * loquat-core test / error.ParseError#addMessages()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos = _pos.SourcePos;

const ErrorMessageType   = _error.ErrorMessageType;
const ErrorMessage       = _error.ErrorMessage;
const ParseError         = _error.ParseError;

describe("#addMessages(msgs)", () => {
    it("should return an `AbstractParseError' object with the specified messages `msgs'"
        + " concatenated to the original messages", () => {
        const pos = new SourcePos("foobar", 496, 28);
        const msgs = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "x"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "y")
        ];
        const err = new ParseError(pos, msgs);
        const additionalMsgs = [
            new ErrorMessage(ErrorMessageType.EXPECT, "z"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "w")
        ];
        const newErr = err.addMessages(additionalMsgs);
        expect(SourcePos.equal(newErr.pos, pos)).to.be.true;
        expect(ErrorMessage.messagesEqual(newErr.msgs, msgs.concat(additionalMsgs))).to.be.true;
    });
});

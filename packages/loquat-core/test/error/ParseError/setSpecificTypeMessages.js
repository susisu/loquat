/*
 * loquat-core test / error.ParseError#setSpecificTypeMessages()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("pos.js");
const { ErrorMessageType, ErrorMessage, ParseError } = require("error.js");

describe("#setSpecificTypeMessages(type, msgStrs)", () => {
    it("should return an `AbstractParseError' object with all the messages of the specified `type' removed"
        + " and new messages given by `msgStrs' added to the tail of the messages", () => {
        let pos = new SourcePos("foobar", 496, 28);
        let msgs = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "x"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "y"),
            new ErrorMessage(ErrorMessageType.EXPECT, "z"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "w")
        ];
        let err = new ParseError(pos, msgs);
        let newErr = err.setSpecificTypeMessages(ErrorMessageType.UNEXPECT, ["nyan", "cat"]);
        expect(SourcePos.equal(newErr.pos, pos)).to.be.true;
        expect(ErrorMessage.messagesEqual(newErr.msgs, [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "x"),
            new ErrorMessage(ErrorMessageType.EXPECT, "z"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "w"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "nyan"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "cat")
        ])).to.be.true;
    });
});

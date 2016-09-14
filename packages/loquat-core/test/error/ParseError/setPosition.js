/*
 * loquat-core test / error.ParseError#setPosition()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("pos.js");
const { ErrorMessageType, ErrorMessage, ParseError } = require("error.js");

describe("#setPosition(pos)", () => {
    it("should return an `IParseError' object with the specified position `pos'", () => {
        let pos = new SourcePos("foobar", 496, 28);
        let msgs = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "x"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "y"),
            new ErrorMessage(ErrorMessageType.EXPECT, "z"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "w")
        ];
        let err = new ParseError(pos, msgs);
        let newPos = new SourcePos("nyancat", 128, 256);
        let newErr = err.setPosition(newPos);
        expect(SourcePos.equal(newErr.pos, newPos)).to.be.true;
        expect(ErrorMessage.messagesEqual(newErr.msgs, msgs)).to.be.true;
    });
});

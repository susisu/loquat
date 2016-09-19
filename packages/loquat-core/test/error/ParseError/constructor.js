/*
 * loquat test / error.ParseError constructor()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("pos.js");
const { ErrorMessageType, ErrorMessage, ParseError } = require("error.js");

describe("constructor(pos, msgs)", () => {
    it("should create a new `ParseError' instance", () => {
        let pos = new SourcePos("foobar", 496, 28);
        let msgs = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
        ];
        let err = new ParseError(pos, msgs);
        expect(err).to.be.an.instanceOf(ParseError);
        expect(SourcePos.equal(err.pos, pos)).to.be.true;
        expect(ErrorMessage.messagesEqual(err.msgs, msgs)).to.be.true;
    });
});

/*
 * loquat-core test / error.ParseError#pos
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("pos.js");
const { ErrorMessageType, ErrorMessage, ParseError } = require("error.js");

describe("#pos", () => {
    it("should get position of the error", () => {
        let pos = new SourcePos("foobar", 496, 28);
        let msgs = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
        ];
        let err = new ParseError(pos, msgs);
        expect(SourcePos.equal(err.pos, pos)).to.be.true;
    });
});

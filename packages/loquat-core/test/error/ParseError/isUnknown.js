/*
 * loquat test / error.ParseError#isUnknown()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("pos.js");
const { ErrorMessageType, ErrorMessage, ParseError } = require("error.js");

describe("#isUnknown()", () => {
    it("should return `true' if the error messages list is empty", () => {
        let pos = new SourcePos("foobar", 496, 28);
        let err = new ParseError(pos, []);
        expect(err.isUnknown()).to.be.true;
    });

    it("should return `false' if the error messages list is not empty", () => {
        let pos = new SourcePos("foobar", 496, 28);
        let msgs = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
        ];
        let err = new ParseError(pos, msgs);
        expect(err.isUnknown()).to.be.false;
    });
});

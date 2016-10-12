/*
 * loquat-core test / error.ParseError#isUnknown()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos = _pos.SourcePos;

const ErrorMessageType   = _error.ErrorMessageType;
const ErrorMessage       = _error.ErrorMessage;
const ParseError         = _error.ParseError;

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

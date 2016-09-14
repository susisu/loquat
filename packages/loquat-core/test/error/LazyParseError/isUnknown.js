/*
 * loquat-core test / error.LazyParseError#isUnknown()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("pos.js");
const { ErrorMessageType, ErrorMessage, ParseError, LazyParseError } = require("error.js");

describe("#isUnknown()", () => {
    it("should first evaluate the thunk return `true' if the error messages list is empty", () => {
        let pos = new SourcePos("foobar", 496, 28);
        let evaluated = false;
        let err = new LazyParseError(() => {
            evaluated = true;
            return new ParseError(pos, []);
        });
        expect(err.isUnknown()).to.be.true;
        expect(evaluated).to.be.true;
    });

    it("should first evaluate the thunk return `false' if the error messages list is not empty", () => {
        let pos = new SourcePos("foobar", 496, 28);
        let msgs = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
        ];
        let evaluated = false;
        let err = new LazyParseError(() => {
            evaluated = true;
            return new ParseError(pos, msgs);
        });
        expect(err.isUnknown()).to.be.false;
        expect(evaluated).to.be.true;
    });
});

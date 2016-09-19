/*
 * loquat test / error.LazyParseError#toString()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("pos.js");
const { ErrorMessageType, ErrorMessage, ParseError, LazyParseError } = require("error.js");

describe("#toString()", () => {
    it("should first evaluate the thunk and return the string representation of the error", () => {
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
        expect(err.toString()).to.equal(
            "\"foobar\"(line 496, column 28):\n"
            + "unexpected bar\n"
            + "expecting baz\n"
            + "nyancat"
        );
        expect(evaluated).to.be.true;
    });
});

/*
 * loquat-core test / error.AbstractParseError#setMessages()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { ErrorMessageType, ErrorMessage, AbstractParseError } = require("error.js");

describe("#setMessages(msgs)", () => {
    it("should throw an `Error'", () => {
        let TestParseError = class extends AbstractParseError {
            constructor() {
                super();
            }
        };
        let err = new TestParseError();
        let msgs = [
            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "foo"),
            new ErrorMessage(ErrorMessageType.UNEXPECT, "bar"),
            new ErrorMessage(ErrorMessageType.EXPECT, "baz"),
            new ErrorMessage(ErrorMessageType.MESSAGE, "nyancat")
        ];
        expect(() => { err.setMessages(msgs); }).to.throw(Error);
    });
});

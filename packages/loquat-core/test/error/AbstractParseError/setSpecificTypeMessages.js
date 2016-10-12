/*
 * loquat-core test / error.AbstractParseError#setSpecificTypeMessages()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const ErrorMessageType   = _error.ErrorMessageType;
const AbstractParseError = _error.AbstractParseError;

describe("#setSpecificTypeMessages(type, msgStrs)", () => {
    it("should throw an `Error'", () => {
        let TestParseError = class extends AbstractParseError {
            constructor() {
                super();
            }
        };
        let err = new TestParseError();
        expect(() => {
            err.setSpecificTypeMessages(ErrorMessageType.MESSAGE, ["foo", "bar", "baz"]);
        }).to.throw(Error);
    });
});

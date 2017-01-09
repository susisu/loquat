/*
 * loquat-core test / error.AbstractParseError#setSpecificTypeMessages()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const ErrorMessageType   = _error.ErrorMessageType;
const AbstractParseError = _error.AbstractParseError;

describe("#setSpecificTypeMessages(type, msgStrs)", () => {
    it("should throw an `Error'", () => {
        const TestParseError = class extends AbstractParseError {
            constructor() {
                super();
            }
        };
        const err = new TestParseError();
        expect(() => {
            err.setSpecificTypeMessages(ErrorMessageType.MESSAGE, ["foo", "bar", "baz"]);
        }).to.throw(Error);
    });
});

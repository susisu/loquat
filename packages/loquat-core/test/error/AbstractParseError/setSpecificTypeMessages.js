/*
 * loquat test / error.AbstractParseError#setSpecificTypeMessages()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { ErrorMessageType, AbstractParseError } = require("error.js");

describe("#setSpecificTypeMessages()", () => {
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

/*
 * loquat test / error.AbstractParseError#toString()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { AbstractParseError } = require("error.js");

describe("#toString()", () => {
    it("should throw an `Error'", () => {
        let TestParseError = class extends AbstractParseError {
            constructor() {
                super();
            }
        };
        let err = new TestParseError();
        expect(() => { err.toString(); }).to.throw(Error);
    });
});

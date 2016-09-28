/*
 * loquat-core test / error.AbstractParseError#isUnknown()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { AbstractParseError } = require("error.js");

describe("#isUnknown()", () => {
    it("should throw an `Error'", () => {
        let TestParseError = class extends AbstractParseError {
            constructor() {
                super();
            }
        };
        let err = new TestParseError();
        expect(() => { err.isUnknown(); }).to.throw(Error);
    });
});

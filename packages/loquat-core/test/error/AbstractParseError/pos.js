/*
 * loquat-core test / error.AbstractParseError#pos
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { AbstractParseError } = require("error.js");

describe("#pos", () => {
    it("should throw an `Error'", () => {
        let TestParseError = class extends AbstractParseError {
            constructor() {
                super();
            }
        };
        let err = new TestParseError();
        expect(() => { err.pos; }).to.throw(Error);
    });
});

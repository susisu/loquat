/*
 * loquat-core test / error.AbstractParseError#pos
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const _error = require("error.js");
const AbstractParseError = _error.AbstractParseError;

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

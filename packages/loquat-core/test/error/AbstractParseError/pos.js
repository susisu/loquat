/*
 * loquat-core test / error.AbstractParseError#pos
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const AbstractParseError = _error.AbstractParseError;

describe("#pos", () => {
    it("should throw an `Error'", () => {
        const TestParseError = class extends AbstractParseError {
            constructor() {
                super();
            }
        };
        const err = new TestParseError();
        expect(() => { err.pos; }).to.throw(Error);
    });
});

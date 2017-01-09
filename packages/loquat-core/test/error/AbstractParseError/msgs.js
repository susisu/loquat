/*
 * loquat-core test / error.AbstractParseError#msgs
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const AbstractParseError = _error.AbstractParseError;

describe("#msgs", () => {
    it("should throw an `Error'", () => {
        const TestParseError = class extends AbstractParseError {
            constructor() {
                super();
            }
        };
        const err = new TestParseError();
        expect(() => { err.msgs; }).to.throw(Error);
    });
});

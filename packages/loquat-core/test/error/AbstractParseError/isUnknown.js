/*
 * loquat-core test / error.AbstractParseError#isUnknown()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const AbstractParseError = _error.AbstractParseError;

describe("#isUnknown()", () => {
    it("should throw an `Error'", () => {
        const TestParseError = class extends AbstractParseError {
            constructor() {
                super();
            }
        };
        const err = new TestParseError();
        expect(() => { err.isUnknown(); }).to.throw(Error);
    });
});

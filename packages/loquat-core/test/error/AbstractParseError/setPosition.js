/*
 * loquat-core test / error.AbstractParseError#setPosition()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos = _pos.SourcePos;

const AbstractParseError = _error.AbstractParseError;

describe("#setPosition(pos)", () => {
    it("should throw an `Error'", () => {
        const TestParseError = class extends AbstractParseError {
            constructor() {
                super();
            }
        };
        const err = new TestParseError();
        const pos = new SourcePos("foobar", 496, 28);
        expect(() => { err.setPosition(pos); }).to.throw(Error);
    });
});

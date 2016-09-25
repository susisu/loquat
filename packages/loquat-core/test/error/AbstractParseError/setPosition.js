/*
 * loquat test / error.AbstractParseError#setPosition()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("pos.js");
const { AbstractParseError } = require("error.js");

describe("#setPosition(pos)", () => {
    it("should throw an `Error'", () => {
        let TestParseError = class extends AbstractParseError {
            constructor() {
                super();
            }
        };
        let err = new TestParseError();
        let pos = new SourcePos("foobar", 496, 28);
        expect(() => { err.setPosition(pos); }).to.throw(Error);
    });
});

/*
 * loquat-core test / pos.SourcePos#clone()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("../../../lib/pos.js");

describe("#clone()", () => {
    it("should create a copy of the `SourcePos' object", () => {
        let pos  = new SourcePos("foobar", 496, 28);
        let copy = pos.clone();
        // different objects
        expect(copy).not.to.equal(pos);
        // describe the same position
        expect(SourcePos.equal(copy, pos)).to.be.true;
    });
});

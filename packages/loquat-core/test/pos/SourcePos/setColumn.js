/*
 * loquat-core test / pos.SourcePos#setColumn
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("../../../lib/pos.js");

describe("#setColumn(column)", () => {
    it("should create a copy of the `SourcePos' object with the specified column", () => {
        let pos  = new SourcePos("foobar", 496, 28);
        let copy = pos.setColumn(6);
        // different objects
        expect(copy).not.to.equal(pos);
        // with different columns
        expect(copy.name).to.equal("foobar");
        expect(copy.line).to.equal(496);
        expect(copy.column).to.equal(6);
    });
});

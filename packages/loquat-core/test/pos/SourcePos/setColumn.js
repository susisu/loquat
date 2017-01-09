/*
 * loquat-core test / pos.SourcePos#setColumn()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos = _pos.SourcePos;

describe("#setColumn(column)", () => {
    it("should create a copy of the `SourcePos' object with the specified column", () => {
        const pos  = new SourcePos("foobar", 496, 28);
        const copy = pos.setColumn(6);
        // different objects
        expect(copy).not.to.equal(pos);
        // with different columns
        expect(copy.name).to.equal("foobar");
        expect(copy.line).to.equal(496);
        expect(copy.column).to.equal(6);
    });
});

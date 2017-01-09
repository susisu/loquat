/*
 * loquat-core test / pos.SourcePos#setLine()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos = _pos.SourcePos;

describe("#setLine(line)", () => {
    it("should create a copy of the `SourcePos' object with the specified line", () => {
        const pos  = new SourcePos("foobar", 496, 28);
        const copy = pos.setLine(6);
        // different objects
        expect(copy).not.to.equal(pos);
        // with different lines
        expect(copy.name).to.equal("foobar");
        expect(copy.line).to.equal(6);
        expect(copy.column).to.equal(28);
    });
});

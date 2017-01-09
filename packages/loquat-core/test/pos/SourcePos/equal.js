/*
 * loquat-core test / pos.SourcePos.equal()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos = _pos.SourcePos;

describe(".equal(posA, posB)", () => {
    it("should return true if `posA' and `posB' describe the same position", () => {
        const posA = new SourcePos("foobar", 496, 28);
        const posB = new SourcePos("foobar", 496, 28);
        expect(SourcePos.equal(posA, posB)).to.be.true;
        expect(SourcePos.equal(posB, posA)).to.be.true;
    });

    it("should return false is `posA' and `posB' describe different positions", () => {
        // different files
        {
            const posA = new SourcePos("foobar", 496, 28);
            const posB = new SourcePos("nyancat", 496, 28);
            expect(SourcePos.equal(posA, posB)).to.be.false;
            expect(SourcePos.equal(posB, posA)).to.be.false;
        }
        // different lines
        {
            const posA = new SourcePos("foobar", 496, 28);
            const posB = new SourcePos("foobar", 6, 28);
            expect(SourcePos.equal(posA, posB)).to.be.false;
            expect(SourcePos.equal(posB, posA)).to.be.false;
        }
        // different columns
        {
            const posA = new SourcePos("foobar", 496, 28);
            const posB = new SourcePos("foobar", 496, 6);
            expect(SourcePos.equal(posA, posB)).to.be.false;
            expect(SourcePos.equal(posB, posA)).to.be.false;
        }
        // all different
        {
            const posA = new SourcePos("foobar", 496, 28);
            const posB = new SourcePos("nyancat", 6, 1);
            expect(SourcePos.equal(posA, posB)).to.be.false;
            expect(SourcePos.equal(posB, posA)).to.be.false;
        }
    });
});

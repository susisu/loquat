/*
 * loquat-core test / pos.SourcePos.compare()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos = _pos.SourcePos;

describe(".compare(posA, posB)", () => {
    it("should return negative number if `posA' describes a position ahead of `posB'", () => {
        // posA.name < posB.name
        {
            const posA = new SourcePos("foobar", 496, 28);
            const posB = new SourcePos("nyancat", 496, 28);
            expect(SourcePos.compare(posA, posB)).to.be.lessThan(0);
        }
        // posA.line < posB.line
        {
            const posA = new SourcePos("foobar", 6, 28);
            const posB = new SourcePos("foobar", 496, 28);
            expect(SourcePos.compare(posA, posB)).to.be.lessThan(0);
        }
        // posA.column < posB.column
        {
            const posA = new SourcePos("foobar", 496, 6);
            const posB = new SourcePos("foobar", 496, 28);
            expect(SourcePos.compare(posA, posB)).to.be.lessThan(0);
        }
        // priority: name > line > column
        {
            {
                const posA = new SourcePos("foobar", 496, 28);
                const posB = new SourcePos("nyancat", 6, 28);
                expect(SourcePos.compare(posA, posB)).to.be.lessThan(0);
            }
            {
                const posA = new SourcePos("foobar", 496, 28);
                const posB = new SourcePos("nyancat", 496, 6);
                expect(SourcePos.compare(posA, posB)).to.be.lessThan(0);
            }
            {
                const posA = new SourcePos("foobar", 6, 28);
                const posB = new SourcePos("foobar", 496, 6);
                expect(SourcePos.compare(posA, posB)).to.be.lessThan(0);
            }
        }
    });

    it("should return positive number if `posA' describes a position behind `posB'", () => {
        // posA.name < posB.name
        {
            const posA = new SourcePos("nyancat", 496, 28);
            const posB = new SourcePos("foobar", 496, 28);
            expect(SourcePos.compare(posA, posB)).to.be.greaterThan(0);
        }
        // posA.line < posB.line
        {
            const posA = new SourcePos("foobar", 496, 28);
            const posB = new SourcePos("foobar", 6, 28);
            expect(SourcePos.compare(posA, posB)).to.be.greaterThan(0);
        }
        // posA.column < posB.column
        {
            const posA = new SourcePos("foobar", 496, 28);
            const posB = new SourcePos("foobar", 496, 6);
            expect(SourcePos.compare(posA, posB)).to.be.greaterThan(0);
        }
        // priority: name > line > column
        {
            {
                const posA = new SourcePos("nyancat", 6, 28);
                const posB = new SourcePos("foobar", 496, 28);
                expect(SourcePos.compare(posA, posB)).to.be.greaterThan(0);
            }
            {
                const posA = new SourcePos("nyancat", 496, 6);
                const posB = new SourcePos("foobar", 496, 28);
                expect(SourcePos.compare(posA, posB)).to.be.greaterThan(0);
            }
            {
                const posA = new SourcePos("foobar", 496, 6);
                const posB = new SourcePos("foobar", 6, 28);
                expect(SourcePos.compare(posA, posB)).to.be.greaterThan(0);
            }
        }
    });

    it("should return zero if `posA' and `posB' describe the same position", () => {
        const posA = new SourcePos("foobar", 496, 28);
        const posB = new SourcePos("foobar", 496, 28);
        expect(SourcePos.compare(posA, posB)).to.equal(0);
    });
});

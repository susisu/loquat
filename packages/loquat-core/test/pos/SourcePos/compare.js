/*
 * loquat-core test / pos.SourcePos.compare()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("pos.js");

describe(".compare(posA, posB)", () => {
    it("should return negative number if `posA' describes a position ahead of `posB'", () => {
        // posA.name < posB.name
        {
            let posA = new SourcePos("foobar", 496, 28);
            let posB = new SourcePos("nyancat", 496, 28);
            expect(SourcePos.compare(posA, posB)).to.be.lessThan(0);
        }
        // posA.line < posB.line
        {
            let posA = new SourcePos("foobar", 6, 28);
            let posB = new SourcePos("foobar", 496, 28);
            expect(SourcePos.compare(posA, posB)).to.be.lessThan(0);
        }
        // posA.column < posB.column
        {
            let posA = new SourcePos("foobar", 496, 6);
            let posB = new SourcePos("foobar", 496, 28);
            expect(SourcePos.compare(posA, posB)).to.be.lessThan(0);
        }
        // priority: name > line > column
        {
            {
                let posA = new SourcePos("foobar", 496, 28);
                let posB = new SourcePos("nyancat", 6, 28);
                expect(SourcePos.compare(posA, posB)).to.be.lessThan(0);
            }
            {
                let posA = new SourcePos("foobar", 496, 28);
                let posB = new SourcePos("nyancat", 496, 6);
                expect(SourcePos.compare(posA, posB)).to.be.lessThan(0);
            }
            {
                let posA = new SourcePos("foobar", 6, 28);
                let posB = new SourcePos("foobar", 496, 6);
                expect(SourcePos.compare(posA, posB)).to.be.lessThan(0);
            }
        }
    });

    it("should return positive number if `posA' describes a position behind `posB'", () => {
        // posA.name < posB.name
        {
            let posA = new SourcePos("nyancat", 496, 28);
            let posB = new SourcePos("foobar", 496, 28);
            expect(SourcePos.compare(posA, posB)).to.be.greaterThan(0);
        }
        // posA.line < posB.line
        {
            let posA = new SourcePos("foobar", 496, 28);
            let posB = new SourcePos("foobar", 6, 28);
            expect(SourcePos.compare(posA, posB)).to.be.greaterThan(0);
        }
        // posA.column < posB.column
        {
            let posA = new SourcePos("foobar", 496, 28);
            let posB = new SourcePos("foobar", 496, 6);
            expect(SourcePos.compare(posA, posB)).to.be.greaterThan(0);
        }
        // priority: name > line > column
        {
            {
                let posA = new SourcePos("nyancat", 6, 28);
                let posB = new SourcePos("foobar", 496, 28);
                expect(SourcePos.compare(posA, posB)).to.be.greaterThan(0);
            }
            {
                let posA = new SourcePos("nyancat", 496, 6);
                let posB = new SourcePos("foobar", 496, 28);
                expect(SourcePos.compare(posA, posB)).to.be.greaterThan(0);
            }
            {
                let posA = new SourcePos("foobar", 496, 6);
                let posB = new SourcePos("foobar", 6, 28);
                expect(SourcePos.compare(posA, posB)).to.be.greaterThan(0);
            }
        }
    });

    it("should return zero if `posA' and `posB' describe the same position", () => {
        let posA = new SourcePos("foobar", 496, 28);
        let posB = new SourcePos("foobar", 496, 28);
        expect(SourcePos.compare(posA, posB)).to.equal(0);
    });
});

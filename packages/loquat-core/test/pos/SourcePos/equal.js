/*
 * loquat-core test / pos.SourcePos.equal()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos = _pos.SourcePos;

describe(".equal(posA, posB)", () => {
    it("should return true if `posA' and `posB' describe the same position", () => {
        let posA = new SourcePos("foobar", 496, 28);
        let posB = new SourcePos("foobar", 496, 28);
        expect(SourcePos.equal(posA, posB)).to.be.true;
        expect(SourcePos.equal(posB, posA)).to.be.true;
    });

    it("should return false is `posA' and `posB' describe different positions", () => {
        // different files
        {
            let posA = new SourcePos("foobar", 496, 28);
            let posB = new SourcePos("nyancat", 496, 28);
            expect(SourcePos.equal(posA, posB)).to.be.false;
            expect(SourcePos.equal(posB, posA)).to.be.false;
        }
        // different lines
        {
            let posA = new SourcePos("foobar", 496, 28);
            let posB = new SourcePos("foobar", 6, 28);
            expect(SourcePos.equal(posA, posB)).to.be.false;
            expect(SourcePos.equal(posB, posA)).to.be.false;
        }
        // different columns
        {
            let posA = new SourcePos("foobar", 496, 28);
            let posB = new SourcePos("foobar", 496, 6);
            expect(SourcePos.equal(posA, posB)).to.be.false;
            expect(SourcePos.equal(posB, posA)).to.be.false;
        }
        // all different
        {
            let posA = new SourcePos("foobar", 496, 28);
            let posB = new SourcePos("nyancat", 6, 1);
            expect(SourcePos.equal(posA, posB)).to.be.false;
            expect(SourcePos.equal(posB, posA)).to.be.false;
        }
    });
});

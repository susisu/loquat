/*
 * loquat-core test / pos.SourcePos#addChar()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos = _pos.SourcePos;

describe("#addChar(char, tabWidth)", () => {
    it("should create a copy but not change the position if `char' is empty", () => {
        const pos  = new SourcePos("foobar", 496, 28);
        const copy = pos.addChar("", 8);
        expect(copy).not.to.equal(pos);
        expect(SourcePos.equal(copy, pos)).to.be.true;
    });

    it("should create a copy with line incremented by 1 and column set to 1"
        + " if `char' is LF (0x0A)", () => {
        const pos  = new SourcePos("foobar", 496, 28);
        const copy = pos.addChar("\n", 8);
        expect(copy).not.to.equal(pos);
        expect(copy.name).to.equal("foobar");
        expect(copy.line).to.equal(497);
        expect(copy.column).to.equal(1);
    });

    it("should create a copy with column incremented based on `tabWidth'"
        + " if `char' is a tab character (0x09)", () => {
        {
            const pos  = new SourcePos("foobar", 496, 1);
            const copy = pos.addChar("\t", 8);
            expect(copy).not.to.equal(pos);
            expect(copy.name).to.equal("foobar");
            expect(copy.line).to.equal(496);
            expect(copy.column).to.equal(9);
        }
        {
            const pos  = new SourcePos("foobar", 496, 5);
            const copy = pos.addChar("\t", 8);
            expect(copy).not.to.equal(pos);
            expect(copy.name).to.equal("foobar");
            expect(copy.line).to.equal(496);
            expect(copy.column).to.equal(9);
        }
        {
            const pos  = new SourcePos("foobar", 496, 10);
            const copy = pos.addChar("\t", 8);
            expect(copy).not.to.equal(pos);
            expect(copy.name).to.equal("foobar");
            expect(copy.line).to.equal(496);
            expect(copy.column).to.equal(17);
        }
        {
            const pos  = new SourcePos("foobar", 496, 1);
            const copy = pos.addChar("\t", 4);
            expect(copy).not.to.equal(pos);
            expect(copy.name).to.equal("foobar");
            expect(copy.line).to.equal(496);
            expect(copy.column).to.equal(5);
        }
        {
            const pos  = new SourcePos("foobar", 496, 3);
            const copy = pos.addChar("\t", 4);
            expect(copy).not.to.equal(pos);
            expect(copy.name).to.equal("foobar");
            expect(copy.line).to.equal(496);
            expect(copy.column).to.equal(5);
        }
        {
            const pos  = new SourcePos("foobar", 496, 6);
            const copy = pos.addChar("\t", 4);
            expect(copy).not.to.equal(pos);
            expect(copy.name).to.equal("foobar");
            expect(copy.line).to.equal(496);
            expect(copy.column).to.equal(9);
        }
    });

    it("should create a copy with column incremented by 1 if `char' is not LF nor a tab character", () => {
        {
            const pos  = new SourcePos("foobar", 496, 28);
            const copy = pos.addChar("A", 8);
            expect(copy).not.to.equal(pos);
            expect(copy.name).to.equal("foobar");
            expect(copy.line).to.equal(496);
            expect(copy.column).to.equal(29);
        }
        {
            const pos  = new SourcePos("foobar", 496, 28);
            const copy = pos.addChar("\u3042", 8);
            expect(copy).not.to.equal(pos);
            expect(copy.name).to.equal("foobar");
            expect(copy.line).to.equal(496);
            expect(copy.column).to.equal(29);
        }
        {
            const pos  = new SourcePos("foobar", 496, 28);
            const copy = pos.addChar("\uD83C\uDF63", 8);
            expect(copy).not.to.equal(pos);
            expect(copy.name).to.equal("foobar");
            expect(copy.line).to.equal(496);
            expect(copy.column).to.equal(29);
        }
    });
});

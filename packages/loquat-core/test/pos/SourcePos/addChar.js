/*
 * loquat-core test / pos.SourcePos#addChar()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("../../../lib/pos.js");

describe("#addChar(char, tabWidth)", () => {
    it("should create a copy but not change the position if `char' is empty", () => {
        let pos  = new SourcePos("foobar", 496, 28);
        let copy = pos.addChar("", 8);
        expect(copy).not.to.equal(pos);
        expect(SourcePos.equal(copy, pos)).to.be.true;
    });

    it("should create a copy with line incremented by 1 and column set to 1"
        + " if `char' is LF (0x0A)", () => {
        let pos  = new SourcePos("foobar", 496, 28);
        let copy = pos.addChar("\n", 8);
        expect(copy).not.to.equal(pos);
        expect(copy.name).to.equal("foobar");
        expect(copy.line).to.equal(497);
        expect(copy.column).to.equal(1);
    });

    it("should create a copy with column incremented based on `tabWidth'"
        + " if `char' is a tab character (0x09)", () => {
        {
            let pos  = new SourcePos("foobar", 496, 1);
            let copy = pos.addChar("\t", 8);
            expect(copy).not.to.equal(pos);
            expect(copy.name).to.equal("foobar");
            expect(copy.line).to.equal(496);
            expect(copy.column).to.equal(9);
        }
        {
            let pos  = new SourcePos("foobar", 496, 5);
            let copy = pos.addChar("\t", 8);
            expect(copy).not.to.equal(pos);
            expect(copy.name).to.equal("foobar");
            expect(copy.line).to.equal(496);
            expect(copy.column).to.equal(9);
        }
        {
            let pos  = new SourcePos("foobar", 496, 10);
            let copy = pos.addChar("\t", 8);
            expect(copy).not.to.equal(pos);
            expect(copy.name).to.equal("foobar");
            expect(copy.line).to.equal(496);
            expect(copy.column).to.equal(17);
        }
        {
            let pos  = new SourcePos("foobar", 496, 1);
            let copy = pos.addChar("\t", 4);
            expect(copy).not.to.equal(pos);
            expect(copy.name).to.equal("foobar");
            expect(copy.line).to.equal(496);
            expect(copy.column).to.equal(5);
        }
        {
            let pos  = new SourcePos("foobar", 496, 3);
            let copy = pos.addChar("\t", 4);
            expect(copy).not.to.equal(pos);
            expect(copy.name).to.equal("foobar");
            expect(copy.line).to.equal(496);
            expect(copy.column).to.equal(5);
        }
        {
            let pos  = new SourcePos("foobar", 496, 6);
            let copy = pos.addChar("\t", 4);
            expect(copy).not.to.equal(pos);
            expect(copy.name).to.equal("foobar");
            expect(copy.line).to.equal(496);
            expect(copy.column).to.equal(9);
        }
    });

    it("should create a copy with column incremented by 1 if `char' is not LF nor a tab character", () => {
        {
            let pos  = new SourcePos("foobar", 496, 28);
            let copy = pos.addChar("A", 8);
            expect(copy).not.to.equal(pos);
            expect(copy.name).to.equal("foobar");
            expect(copy.line).to.equal(496);
            expect(copy.column).to.equal(29);
        }
        {
            let pos  = new SourcePos("foobar", 496, 28);
            let copy = pos.addChar("\u3042", 8);
            expect(copy).not.to.equal(pos);
            expect(copy.name).to.equal("foobar");
            expect(copy.line).to.equal(496);
            expect(copy.column).to.equal(29);
        }
        {
            let pos  = new SourcePos("foobar", 496, 28);
            let copy = pos.addChar("\uD83C\uDF63", 8);
            expect(copy).not.to.equal(pos);
            expect(copy.name).to.equal("foobar");
            expect(copy.line).to.equal(496);
            expect(copy.column).to.equal(29);
        }
    });
});

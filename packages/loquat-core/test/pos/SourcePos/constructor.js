/*
 * loquat-core test / pos.SourcePos constructor()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos = _pos.SourcePos;

describe("constructor(name, line, column)", () => {
    it("should create a new `SourcePos' instance", () => {
        const pos = new SourcePos("foobar", 496, 28);
        expect(pos).to.be.an.instanceOf(SourcePos);
        expect(pos.name).to.equal("foobar");
        expect(pos.line).to.equal(496);
        expect(pos.column).to.equal(28);
    });
});

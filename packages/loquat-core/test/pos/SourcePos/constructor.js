/*
 * loquat-core test / pos.SourcePos constructor()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("../../../lib/pos.js");

describe("constructor(name, line, column)", () => {
    it("should create a new `SourcePos' instance", () => {
        let pos = new SourcePos("foobar", 496, 28);
        expect(pos).to.be.an.instanceOf(SourcePos);
        expect(pos.name).to.equal("foobar");
        expect(pos.line).to.equal(496);
        expect(pos.column).to.equal(28);
    });
});

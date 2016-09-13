/*
 * loquat-core test / pos.SourcePos.init()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("../../../lib/pos.js");

describe(".init(name)", () => {
    it("should create a new `SourcePos' instance with `line = 1' and `column = 1'", () => {
        let pos = SourcePos.init("foobar");
        expect(pos).to.be.an.instanceOf(SourcePos);
        expect(pos.name).to.equal("foobar");
        expect(pos.line).to.equal(1);
        expect(pos.column).to.equal(1);
    });
});

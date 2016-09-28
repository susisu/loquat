/*
 * loquat-core test / pos.SourcePos.init()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const _pos = require("pos.js");
const SourcePos = _pos.SourcePos;

describe(".init(name)", () => {
    it("should create a new `SourcePos' instance with `line = 1' and `column = 1'", () => {
        let pos = SourcePos.init("foobar");
        expect(pos).to.be.an.instanceOf(SourcePos);
        expect(pos.name).to.equal("foobar");
        expect(pos.line).to.equal(1);
        expect(pos.column).to.equal(1);
    });
});

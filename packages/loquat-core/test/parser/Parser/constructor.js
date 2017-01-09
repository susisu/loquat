/*
 * loquat-core test / parser.Parser constructor()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const Parser = _parser.Parser;

describe("constructor(func)", () => {
    it("should create a new `Parser' instance", () => {
        const parser = new Parser(() => {});
        expect(parser).to.be.an.instanceOf(Parser);
    });
});

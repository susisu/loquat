/*
 * loquat-core test / parser.Parser constructor()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { Parser } = require("parser.js");

describe("constructor(func)", () => {
    it("should create a new `Parser' instance", () => {
        let parser = new Parser(() => {});
        expect(parser).to.be.an.instanceOf(Parser);
    });
});

/*
 * loquat test / prim.Parser constructor()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { Parser } = require("prim.js");

describe("constructor()", () => {
    it("should create a new `Parser' instance", () => {
        let parser = new Parser(() => {});
        expect(parser).to.be.an.instanceOf(Parser);
    });
});

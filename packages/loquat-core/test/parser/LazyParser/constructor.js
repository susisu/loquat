/*
 * loquat-core test / parser.LazyParser constructor()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const _parser = require("parser.js");
const Parser     = _parser.Parser;
const LazyParser = _parser.LazyParser;

describe("constructor(thunk)", () => {
    it("should create a new `LazyParser' instance", () => {
        let parser = new LazyParser(() => new Parser(() => {}));
        expect(parser).to.be.an.instanceOf(LazyParser);
    });
});

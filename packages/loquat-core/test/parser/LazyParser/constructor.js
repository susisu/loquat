/*
 * loquat-core test / parser.LazyParser constructor()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const Parser     = _parser.Parser;
const LazyParser = _parser.LazyParser;

describe("constructor(thunk)", () => {
    it("should create a new `LazyParser' instance", () => {
        const parser = new LazyParser(() => new Parser(() => {}));
        expect(parser).to.be.an.instanceOf(LazyParser);
    });
});

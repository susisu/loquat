/*
 * loquat-core test / parser.lazy()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const Parser     = _parser.Parser;
const LazyParser = _parser.LazyParser;
const lazy       = _parser.lazy;

describe(".lazy(thunk)", () => {
    it("should create a new `LazyParser' instance", () => {
        const p = new Parser(() => {});
        const parser = lazy(() => p);
        expect(parser).to.be.an.instanceOf(LazyParser);
        const res = parser.eval();
        expect(res).to.equal(p);
    });
});

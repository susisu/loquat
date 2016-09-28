/*
 * loquat-core test / parser.lazy()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const _parser = require("parser.js");
const Parser     = _parser.Parser;
const LazyParser = _parser.LazyParser;
const lazy       = _parser.lazy;

describe(".lazy(thunk)", () => {
    it("should create a new `LazyParser' instance", () => {
        let p = new Parser(() => {});
        let parser = lazy(() => p);
        expect(parser).to.be.an.instanceOf(LazyParser);
        let res = parser.eval();
        expect(res).to.equal(p);
    });
});

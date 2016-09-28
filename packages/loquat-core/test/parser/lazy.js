/*
 * loquat-core test / parser.lazy()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { Parser, LazyParser, lazy } = require("parser.js");

describe(".lazy(thunk)", () => {
    it("should create a new `LazyParser' instance", () => {
        let p = new Parser(() => {});
        let parser = lazy(() => p);
        expect(parser).to.be.an.instanceOf(LazyParser);
        let res = parser.eval();
        expect(res).to.equal(p);
    });
});

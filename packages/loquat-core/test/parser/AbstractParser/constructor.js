/*
 * loquat-core test / parser.AbstractParser constructor()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const _parser = require("parser.js");
const AbstractParser = _parser.AbstractParser;

describe("constructor()", () => {
    it("should throw an `Error' if it is called as `new AbstractParser'", () => {
        expect(() => { new AbstractParser(); }).to.throw(Error);
    });

    it("should not throw an `Error' if it is called as `super' from child constructor", () => {
        let TestParser = class extends AbstractParser {
            constructor() {
                super();
            }
        };
        expect(() => { new TestParser(); }).not.to.throw(Error);
    });
});

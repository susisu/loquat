/*
 * loquat-core test / parser.AbstractParser constructor()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const AbstractParser = _parser.AbstractParser;

describe("constructor()", () => {
    it("should throw an `Error' if it is called as `new AbstractParser'", () => {
        expect(() => { new AbstractParser(); }).to.throw(Error);
    });

    it("should not throw an `Error' if it is called as `super' from child constructor", () => {
        const TestParser = class extends AbstractParser {
            constructor() {
                super();
            }
        };
        expect(() => { new TestParser(); }).not.to.throw(Error);
    });
});

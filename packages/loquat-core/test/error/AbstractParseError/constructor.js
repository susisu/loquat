/*
 * loquat-core test / error.AbstractParseError constructor()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const AbstractParseError = _error.AbstractParseError;

describe("constructor()", () => {
    it("should throw an `Error' if it is called as `new AbstractParseError'", () => {
        expect(() => { new AbstractParseError(); }).to.throw(Error);
    });

    it("should not throw an `Error' if it is called as `super' from child constructor", () => {
        const TestParseError = class extends AbstractParseError {
            constructor() {
                super();
            }
        };
        expect(() => { new TestParseError(); }).not.to.throw(Error);
    });
});

/*
 * loquat-core test / error.AbstractParseError constructor()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { AbstractParseError } = require("error.js");

describe("constructor()", () => {
    it("should throw an `Error' if it is called as `new AbstractParseError'", () => {
        expect(() => { new AbstractParseError(); }).to.throw(Error);
    });

    it("should not throw an `Error' if it is called as `super' from child constructor", () => {
        let TestParseError = class extends AbstractParseError {
            constructor() {
                super();
            }
        };
        expect(() => { new TestParseError(); }).not.to.throw(Error);
    });
});

/*
 * loquat test / prim.AbstractParser#run()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { AbstractParser } = require("prim.js");

describe("#run()", () => {
    it("should throw an `Error'", () => {
        let TestParser = class extends AbstractParser {
            constructor() {
                super();
            }
        };
        let parser = new TestParser();
        expect(() => { parser.run(); }).to.throw(Error);
    });
});

/*
 * loquat-core test / parser.AbstractParser#run()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const _parser = require("parser.js");
const AbstractParser = _parser.AbstractParser;

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

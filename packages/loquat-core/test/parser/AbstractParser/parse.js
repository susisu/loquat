/*
 * loquat-core test / parser.AbstractParser#parse()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const AbstractParser = _parser.AbstractParser;

describe("#parse()", () => {
    it("should throw an `Error'", () => {
        const TestParser = class extends AbstractParser {
            constructor() {
                super();
            }
        };
        const parser = new TestParser();
        expect(() => {
            parser.parse("foobar", "input", "none", { tabWidth: 4, unicode: true });
        }).to.throw(Error);
        expect(() => { parser.parse("foobar", "input"); }).to.throw(Error);
    });
});

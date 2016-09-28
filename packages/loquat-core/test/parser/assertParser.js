/*
 * loquat-core test / parser.assertParser()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const _parser = require("parser.js");
const AbstractParser = _parser.AbstractParser;
const Parser         = _parser.Parser;
const LazyParser     = _parser.LazyParser;
const assertParser   = _parser.assertParser;

describe(".assertParser(val)", () => {
    it("should do nothing and return `undefined' if `val' is an instance of `AbstractParser'", () => {
        {
            let parser = new Parser(() => {});
            expect(assertParser(parser)).to.be.undefined;
        }
        {
            let parser = new LazyParser(() => new Parser(() => {}));
            expect(assertParser(parser)).to.be.undefined;
        }
        {
            let TestParser = class extends AbstractParser {
                constructor() {
                    super();
                }
            };
            let parser = new TestParser();
            expect(assertParser(parser)).to.be.undefined;
        }
    });

    it("should throw an `Error' if `val' is not an instance of `AbstractParser'", () => {
        let values = [
            null,
            undefined,
            "foobar",
            496,
            true,
            {},
            () => {}
        ];
        for (let val of values) {
            expect(() => { assertParser(val); }).to.throw(Error);
        }
    });
});

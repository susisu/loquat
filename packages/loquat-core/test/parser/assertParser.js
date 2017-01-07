/*
 * loquat-core test / parser.assertParser()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const AbstractParser = _parser.AbstractParser;
const Parser         = _parser.Parser;
const LazyParser     = _parser.LazyParser;
const assertParser   = _parser.assertParser;

describe(".assertParser(val)", () => {
    it("should do nothing and return `undefined' if `val' is an instance of `AbstractParser'", () => {
        {
            const parser = new Parser(() => {});
            expect(assertParser(parser)).to.be.undefined;
        }
        {
            const parser = new LazyParser(() => new Parser(() => {}));
            expect(assertParser(parser)).to.be.undefined;
        }
        {
            const TestParser = class extends AbstractParser {
                constructor() {
                    super();
                }
            };
            const parser = new TestParser();
            expect(assertParser(parser)).to.be.undefined;
        }
    });

    it("should throw an `Error' if `val' is not an instance of `AbstractParser'", () => {
        const values = [
            null,
            undefined,
            "foobar",
            496,
            true,
            {},
            () => {}
        ];
        for (const val of values) {
            expect(() => { assertParser(val); }).to.throw(Error);
        }
    });
});

/*
 * loquat-core test / parser.isParser()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const AbstractParser = _parser.AbstractParser;
const Parser         = _parser.Parser;
const LazyParser     = _parser.LazyParser;
const isParser       = _parser.isParser;

describe(".isParser(val)", () => {
    it("should return true if `val' is an instance of `AbstractParser'", () => {
        {
            const parser = new Parser(() => {});
            expect(isParser(parser)).to.be.true;
        }
        {
            const parser = new LazyParser(() => new Parser(() => {}));
            expect(isParser(parser)).to.be.true;
        }
        {
            const TestParser = class extends AbstractParser {
                constructor() {
                    super();
                }
            };
            const parser = new TestParser();
            expect(isParser(parser)).to.be.true;
        }
    });

    it("should return false if `val' is not an instance of `AbstractParser'", () => {
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
            expect(isParser(val)).to.be.false;
        }
    });
});

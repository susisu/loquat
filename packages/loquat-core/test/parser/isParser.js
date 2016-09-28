/*
 * loquat-core test / parser.isParser()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { AbstractParser, Parser, LazyParser, isParser } = require("parser.js");

describe(".isParser(val)", () => {
    it("should return true if `val' is an instance of `AbstractParser'", () => {
        {
            let parser = new Parser(() => {});
            expect(isParser(parser)).to.be.true;
        }
        {
            let parser = new LazyParser(() => new Parser(() => {}));
            expect(isParser(parser)).to.be.true;
        }
        {
            let TestParser = class extends AbstractParser {
                constructor() {
                    super();
                }
            };
            let parser = new TestParser();
            expect(isParser(parser)).to.be.true;
        }
    });

    it("should return false if `val' is not an instance of `AbstractParser'", () => {
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
            expect(isParser(val)).to.be.false;
        }
    });
});

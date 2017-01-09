/*
 * loquat-core test / parser.extendParser()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const AbstractParser = _parser.AbstractParser;
const Parser         = _parser.Parser;
const LazyParser     = _parser.LazyParser;
const extendParser   = _parser.extendParser;

describe(".extendParser(extensions)", () => {
    it("should extend `AbstractParser.prototype'", () => {
        const extensions = {
            exFoo: "x",
            exBar: "y",
            exBaz: "z"
        };
        expect(Object.getOwnPropertyDescriptor(AbstractParser.prototype, "exFoo")).to.be.undefined;
        expect(Object.getOwnPropertyDescriptor(AbstractParser.prototype, "exBar")).to.be.undefined;
        expect(Object.getOwnPropertyDescriptor(AbstractParser.prototype, "exBaz")).to.be.undefined;

        extendParser(extensions);

        expect(Object.getOwnPropertyDescriptor(AbstractParser.prototype, "exFoo")).to.deep.equal({
            value       : "x",
            writable    : true,
            configurable: true,
            enumerable  : false
        });
        expect(Object.getOwnPropertyDescriptor(AbstractParser.prototype, "exBar")).to.deep.equal({
            value       : "y",
            writable    : true,
            configurable: true,
            enumerable  : false
        });
        expect(Object.getOwnPropertyDescriptor(AbstractParser.prototype, "exBaz")).to.deep.equal({
            value       : "z",
            writable    : true,
            configurable: true,
            enumerable  : false
        });
        // can be accessed from parser objects
        {
            const parser = new Parser(() => {});
            expect(parser.exFoo).to.equal("x");
            expect(parser.exBar).to.equal("y");
            expect(parser.exBaz).to.equal("z");
        }
        {
            const parser = new LazyParser(() => new Parser(() => {}));
            expect(parser.exFoo).to.equal("x");
            expect(parser.exBar).to.equal("y");
            expect(parser.exBaz).to.equal("z");
        }
    });
});

/*
 * loquat test / parser.extendParser()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { AbstractParser, Parser, extendParser } = require("parser.js");

describe(".extendParser(extensions)", () => {
    it("should extend `AbstractParser.prototype'", () => {
        let extensions = {
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
        // can be accessed from parser object
        let parser = new Parser(() => {});
        expect(parser.exFoo).to.equal("x");
        expect(parser.exBar).to.equal("y");
        expect(parser.exBaz).to.equal("z");
    });
});

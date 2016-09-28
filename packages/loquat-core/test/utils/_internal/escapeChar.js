/*
 * loquat-core test / utils._internal.escapeChar()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { _internal: { escapeChar } } = require("utils.js");

describe(".escapeChar(char)", () => {
    it("should escape the character `char' if it is a special character", () => {
        expect(escapeChar("\\")).to.equal("\\\\");
        expect(escapeChar("\"")).to.equal("\\\"");
        expect(escapeChar("\b")).to.equal("\\b");
        expect(escapeChar("\t")).to.equal("\\t");
        expect(escapeChar("\n")).to.equal("\\n");
        expect(escapeChar("\r")).to.equal("\\r");
        expect(escapeChar("\f")).to.equal("\\f");
        expect(escapeChar("\v")).to.equal("\\v");
    });

    it("should return `char' itself if it is not a special character", () => {
        let chars = "09AZaz'`あ安🍣";
        for (let char of chars) {
            expect(escapeChar(char)).to.equal(char);
        }
    });
});

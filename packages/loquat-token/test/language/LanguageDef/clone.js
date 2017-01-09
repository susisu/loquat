/*
 * loquat-token test / language.LanguageDef#clone()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const Parser = _core.Parser;

const LanguageDef = _language.LanguageDef;

describe("#clone()", () => {
    it("should create a copy of the language definition object", () => {
        const def = new LanguageDef({
            commentStart  : "/*",
            commentEnd    : "*/",
            commentLine   : "//",
            nestedComments: false,
            idStart       : new Parser(() => {}),
            idLetter      : new Parser(() => {}),
            opStart       : new Parser(() => {}),
            opLetter      : new Parser(() => {}),
            reservedIds   : ["var", "if", "else", "while"],
            reservedOps   : ["+", "-", "*", "/"],
            caseSensitive : false
        });
        const copy = def.clone();
        expect(copy.commentStart).to.equal("/*");
        expect(copy.commentEnd).to.equal("*/");
        expect(copy.commentLine).to.equal("//");
        expect(copy.nestedComments).to.be.false;
        expect(copy.idStart).to.equal(def.idStart);
        expect(copy.idLetter).to.equal(def.idLetter);
        expect(copy.opStart).to.equal(def.opStart);
        expect(copy.opLetter).to.equal(def.opLetter);
        expect(copy.reservedIds).to.deep.equal(["var", "if", "else", "while"]);
        expect(copy.reservedOps).to.deep.equal(["+", "-", "*", "/"]);
        expect(copy.caseSensitive).to.be.false;
    });
});

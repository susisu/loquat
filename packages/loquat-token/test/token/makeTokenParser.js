/*
 * loquat-token test / token.makeTokenParser()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const Parser       = _core.Parser;
const assertParser = _core.assertParser;

const LanguageDef = _language.LanguageDef;

const makeTokenParser = _token.makeTokenParser;

describe(".makeTokenParser(def)", () => {
    it("should return an object containing token parsers defined by `def'", () => {
        // empty (default) definition (no identifier / operator)
        {
            const def = new LanguageDef({});
            const tp = makeTokenParser(def);
            // white space
            assertParser(tp.whiteSpace);
            expect(tp.lexeme).to.be.a("function");
            expect(tp.symbol).to.be.a("function");
            // symbols
            expect(tp.parens).to.be.a("function");
            expect(tp.braces).to.be.a("function");
            expect(tp.angles).to.be.a("function");
            expect(tp.brackets).to.be.a("function");
            assertParser(tp.semi);
            assertParser(tp.comma);
            assertParser(tp.colon);
            assertParser(tp.dot);
            expect(tp.semiSep).to.be.a("function");
            expect(tp.semiSep1).to.be.a("function");
            expect(tp.commaSep).to.be.a("function");
            expect(tp.commaSep1).to.be.a("function");
            // number literals
            assertParser(tp.decimal);
            assertParser(tp.hexadecimal);
            assertParser(tp.octal);
            assertParser(tp.decimal);
            assertParser(tp.natural);
            assertParser(tp.integer);
            assertParser(tp.float);
            assertParser(tp.naturalOrFloat);
            // character / string literals
            assertParser(tp.charLiteral);
            assertParser(tp.stringLiteral);
            // identifier
            expect(tp.identifier).to.be.undefined;
            expect(tp.reserved).to.be.undefined;
            // operator
            expect(tp.operator).to.be.undefined;
            expect(tp.reservedOp).to.be.undefined;
        }
        // definition with identifier and operator
        {
            const def = new LanguageDef({
                commentStart  : "{-",
                commentEnd    : "-}",
                commentLine   : "--",
                nestedComments: true,
                idStart       : new Parser(() => {}),
                idLetter      : new Parser(() => {}),
                opStart       : new Parser(() => {}),
                opLetter      : new Parser(() => {}),
                reservedIds   : ["if", "then", "else", "let", "in", "do"],
                reservedOps   : ["=", "->", "<-"],
                caseSensitive : true
            });
            const tp = makeTokenParser(def);
            // white space
            assertParser(tp.whiteSpace);
            expect(tp.lexeme).to.be.a("function");
            expect(tp.symbol).to.be.a("function");
            // symbols
            expect(tp.parens).to.be.a("function");
            expect(tp.braces).to.be.a("function");
            expect(tp.angles).to.be.a("function");
            expect(tp.brackets).to.be.a("function");
            assertParser(tp.semi);
            assertParser(tp.comma);
            assertParser(tp.colon);
            assertParser(tp.dot);
            expect(tp.semiSep).to.be.a("function");
            expect(tp.semiSep1).to.be.a("function");
            expect(tp.commaSep).to.be.a("function");
            expect(tp.commaSep1).to.be.a("function");
            // number literals
            assertParser(tp.decimal);
            assertParser(tp.hexadecimal);
            assertParser(tp.octal);
            assertParser(tp.decimal);
            assertParser(tp.natural);
            assertParser(tp.integer);
            assertParser(tp.float);
            assertParser(tp.naturalOrFloat);
            // character / string literals
            assertParser(tp.charLiteral);
            assertParser(tp.stringLiteral);
            // identifier
            assertParser(tp.identifier);
            expect(tp.reserved).to.be.a("function");
            // operator
            assertParser(tp.operator);
            expect(tp.reservedOp).to.be.a("function");
        }
    });

    // tests for each token parser will follow
    require("./makeTokenParser/whiteSpace.js");
    require("./makeTokenParser/lexeme.js");
    require("./makeTokenParser/symbol.js");
    require("./makeTokenParser/parens.js");
    require("./makeTokenParser/braces.js");
    require("./makeTokenParser/angles.js");
    require("./makeTokenParser/brackets.js");
    require("./makeTokenParser/semi.js");
    require("./makeTokenParser/comma.js");
    require("./makeTokenParser/colon.js");
    require("./makeTokenParser/dot.js");
    require("./makeTokenParser/semiSep.js");
    require("./makeTokenParser/semiSep1.js");
    require("./makeTokenParser/commaSep.js");
    require("./makeTokenParser/commaSep1.js");
    require("./makeTokenParser/decimal.js");
    require("./makeTokenParser/hexadecimal.js");
    require("./makeTokenParser/octal.js");
    require("./makeTokenParser/natural.js");
    require("./makeTokenParser/integer.js");
    require("./makeTokenParser/float.js");
    require("./makeTokenParser/naturalOrFloat.js");
    require("./makeTokenParser/charLiteral.js");
    require("./makeTokenParser/stringLiteral.js");
    require("./makeTokenParser/identifier.js");
    require("./makeTokenParser/reserved.js");
});

"use strict";

const { expect } = require("chai");

const { LanguageDef } = _language;
const { makeTokenParser } = _token;

const { createDummyParser } = _test.helper;

describe("makeTokenParser", () => {
  it("should create an object containing token parsers defined by the definition", () => {
    // empty (default) definition (no identifier / operator)
    {
      const def = LanguageDef.create({});
      const tp = makeTokenParser(def);
      // white space
      expect(tp.whiteSpace).to.be.a.parser;
      expect(tp.lexeme).to.be.a("function");
      expect(tp.symbol).to.be.a("function");
      // symbols
      expect(tp.parens).to.be.a("function");
      expect(tp.braces).to.be.a("function");
      expect(tp.angles).to.be.a("function");
      expect(tp.brackets).to.be.a("function");
      expect(tp.semi).to.be.a.parser;
      expect(tp.comma).to.be.a.parser;
      expect(tp.colon).to.be.a.parser;
      expect(tp.dot).to.be.a.parser;
      expect(tp.semiSep).to.be.a("function");
      expect(tp.semiSep1).to.be.a("function");
      expect(tp.commaSep).to.be.a("function");
      expect(tp.commaSep1).to.be.a("function");
      // number literals
      expect(tp.decimal).to.be.a.parser;
      expect(tp.hexadecimal).to.be.a.parser;
      expect(tp.octal).to.be.a.parser;
      expect(tp.decimal).to.be.a.parser;
      expect(tp.natural).to.be.a.parser;
      expect(tp.integer).to.be.a.parser;
      expect(tp.float).to.be.a.parser;
      expect(tp.naturalOrFloat).to.be.a.parser;
      // character / string literals
      expect(tp.charLiteral).to.be.a.parser;
      expect(tp.stringLiteral).to.be.a.parser;
      // identifier
      expect(tp.identifier).to.be.a.parser;
      expect(tp.reserved).to.be.a("function");
      // operator
      expect(tp.operator).to.be.a.parser;
      expect(tp.reservedOp).to.be.a("function");
    }
    // definition with identifier and operator
    {
      const def = LanguageDef.create({
        commentStart  : "{-",
        commentEnd    : "-}",
        commentLine   : "--",
        nestedComments: true,
        idStart       : createDummyParser(),
        idLetter      : createDummyParser(),
        opStart       : createDummyParser(),
        opLetter      : createDummyParser(),
        reservedIds   : ["if", "then", "else", "let", "in", "do"],
        reservedOps   : ["=", "->", "<-"],
        caseSensitive : true,
      });
      const tp = makeTokenParser(def);
      // white space
      expect(tp.whiteSpace).to.be.a.parser;
      expect(tp.lexeme).to.be.a("function");
      expect(tp.symbol).to.be.a("function");
      // symbols
      expect(tp.parens).to.be.a("function");
      expect(tp.braces).to.be.a("function");
      expect(tp.angles).to.be.a("function");
      expect(tp.brackets).to.be.a("function");
      expect(tp.semi).to.be.a.parser;
      expect(tp.comma).to.be.a.parser;
      expect(tp.colon).to.be.a.parser;
      expect(tp.dot).to.be.a.parser;
      expect(tp.semiSep).to.be.a("function");
      expect(tp.semiSep1).to.be.a("function");
      expect(tp.commaSep).to.be.a("function");
      expect(tp.commaSep1).to.be.a("function");
      // number literals
      expect(tp.decimal).to.be.a.parser;
      expect(tp.hexadecimal).to.be.a.parser;
      expect(tp.octal).to.be.a.parser;
      expect(tp.decimal).to.be.a.parser;
      expect(tp.natural).to.be.a.parser;
      expect(tp.integer).to.be.a.parser;
      expect(tp.float).to.be.a.parser;
      expect(tp.naturalOrFloat).to.be.a.parser;
      // character / string literals
      expect(tp.charLiteral).to.be.a.parser;
      expect(tp.stringLiteral).to.be.a.parser;
      // identifier
      expect(tp.identifier).to.be.a.parser;
      expect(tp.reserved).to.be.a("function");
      // operator
      expect(tp.operator).to.be.a.parser;
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
  require("./makeTokenParser/operator.js");
  require("./makeTokenParser/reservedOp.js");
});

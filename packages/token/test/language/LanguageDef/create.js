"use strict";

const { expect } = require("chai");

const { LanguageDef } = $language;

const { createDummyParser } = $testutil.helpers;

describe("create", () => {
  it("should create a new language definition object", () => {
    // use default parameter
    {
      const def = LanguageDef.create();
      expect(def.commentStart).to.be.undefined;
      expect(def.commentEnd).to.be.undefined;
      expect(def.commentLine).to.be.undefined;
      expect(def.nestedComments).to.be.true;
      expect(def.idStart).to.be.undefined;
      expect(def.idLetter).to.be.undefined;
      expect(def.opStart).to.be.undefined;
      expect(def.opLetter).to.be.undefined;
      expect(def.reservedIds).to.be.undefined;
      expect(def.reservedOps).to.be.undefined;
      expect(def.caseSensitive).to.be.true;
    }
    // empty object
    {
      const def = LanguageDef.create({});
      expect(def.commentStart).to.be.undefined;
      expect(def.commentEnd).to.be.undefined;
      expect(def.commentLine).to.be.undefined;
      expect(def.nestedComments).to.be.true;
      expect(def.idStart).to.be.undefined;
      expect(def.idLetter).to.be.undefined;
      expect(def.opStart).to.be.undefined;
      expect(def.opLetter).to.be.undefined;
      expect(def.reservedIds).to.be.undefined;
      expect(def.reservedOps).to.be.undefined;
      expect(def.caseSensitive).to.be.true;
    }
    // fully specified object
    {
      const idStart  = createDummyParser();
      const idLetter = createDummyParser();
      const opStart  = createDummyParser();
      const opLetter = createDummyParser();
      const def = LanguageDef.create({
        commentStart  : "/*",
        commentEnd    : "*/",
        commentLine   : "//",
        nestedComments: false,
        idStart       : idStart,
        idLetter      : idLetter,
        opStart       : opStart,
        opLetter      : opLetter,
        reservedIds   : ["var", "if", "else", "while"],
        reservedOps   : ["+", "-", "*", "/"],
        caseSensitive : false,
      });
      expect(def.commentStart).to.equal("/*");
      expect(def.commentEnd).to.equal("*/");
      expect(def.commentLine).to.equal("//");
      expect(def.nestedComments).to.be.false;
      expect(def.idStart).to.equal(idStart);
      expect(def.idLetter).to.equal(idLetter);
      expect(def.opStart).to.equal(opStart);
      expect(def.opLetter).to.equal(opLetter);
      expect(def.reservedIds).to.deep.equal(["var", "if", "else", "while"]);
      expect(def.reservedOps).to.deep.equal(["+", "-", "*", "/"]);
      expect(def.caseSensitive).to.be.false;
    }
  });
});

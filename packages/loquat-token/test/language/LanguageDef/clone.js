"use strict";

const { expect } = require("chai");

const { LanguageDef } = _language;

const { createDummyParser } = _test.helper;

describe("#clone", () => {
  it("should create a copy of the language definition object", () => {
    const def = new LanguageDef({
      commentStart  : "/*",
      commentEnd    : "*/",
      commentLine   : "//",
      nestedComments: false,
      idStart       : createDummyParser(),
      idLetter      : createDummyParser(),
      opStart       : createDummyParser(),
      opLetter      : createDummyParser(),
      reservedIds   : ["var", "if", "else", "while"],
      reservedOps   : ["+", "-", "*", "/"],
      caseSensitive : false,
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

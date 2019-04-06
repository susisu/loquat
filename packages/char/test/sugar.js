"use strict";

const { expect } = require("chai");

const { createDummyParser } = $testutil.helper;

describe("sugar", () => {
  it("should contain parser extension methods", () => {
    const self = createDummyParser();
    // manyChars
    {
      expect($sugar.manyChars).to.be.a("function");
      const parser = $sugar.manyChars.call(self);
      expect(parser).to.be.a.parser;
    }
    // manyChars1
    {
      expect($sugar.manyChars1).to.be.a("function");
      const parser = $sugar.manyChars1.call(self);
      expect(parser).to.be.a.parser;
    }
  });
});

"use strict";

const { expect } = require("chai");

const { createDummyParser } = _test.helper;

describe("sugar", () => {
  it("should contain parser extension methods", () => {
    const self = createDummyParser();
    // manyChars
    {
      expect(_sugar.manyChars).to.be.a("function");
      const parser = _sugar.manyChars.call(self);
      expect(parser).to.be.a.parser;
    }
    // manyChars1
    {
      expect(_sugar.manyChars1).to.be.a("function");
      const parser = _sugar.manyChars1.call(self);
      expect(parser).to.be.a.parser;
    }
  });
});

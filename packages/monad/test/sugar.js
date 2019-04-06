"use strict";

const { expect } = require("chai");

const { createDummyParser } = $testutil.helper;

describe("sugar", () => {
  it("should contain parser extension methods", () => {
    const self = createDummyParser();
    // forever
    {
      expect($sugar.forever).to.be.a("function");
      const parser = $sugar.forever.call(self);
      expect(parser).to.be.a.parser;
    }
    // discard
    {
      expect($sugar.discard).to.be.a("function");
      const parser = $sugar.discard.call(self);
      expect(parser).to.be.a.parser;
    }
    // void
    {
      expect($sugar.void).to.be.a("function");
      const parser = $sugar.void.call(self);
      expect(parser).to.be.a.parser;
    }
    // join
    {
      expect($sugar.join).to.be.a("function");
      const parser = $sugar.join.call(self);
      expect(parser).to.be.a.parser;
    }
    // when
    {
      expect($sugar.when).to.be.a("function");
      const parser = $sugar.when.call(self, true);
      expect(parser).to.be.a.parser;
    }
    // unless
    {
      expect($sugar.unless).to.be.a("function");
      const parser = $sugar.unless.call(self, false);
      expect(parser).to.be.a.parser;
    }
    // filter
    {
      expect($sugar.filter).to.be.a("function");
      const parser = $sugar.filter.call(self, _ => true);
      expect(parser).to.be.a.parser;
    }
  });
});

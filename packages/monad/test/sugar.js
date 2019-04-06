"use strict";

const { expect } = require("chai");

const { createDummyParser } = _test.helper;

describe("sugar", () => {
  it("should contain parser extension methods", () => {
    const self = createDummyParser();
    // forever
    {
      expect(_sugar.forever).to.be.a("function");
      const parser = _sugar.forever.call(self);
      expect(parser).to.be.a.parser;
    }
    // discard
    {
      expect(_sugar.discard).to.be.a("function");
      const parser = _sugar.discard.call(self);
      expect(parser).to.be.a.parser;
    }
    // void
    {
      expect(_sugar.void).to.be.a("function");
      const parser = _sugar.void.call(self);
      expect(parser).to.be.a.parser;
    }
    // join
    {
      expect(_sugar.join).to.be.a("function");
      const parser = _sugar.join.call(self);
      expect(parser).to.be.a.parser;
    }
    // when
    {
      expect(_sugar.when).to.be.a("function");
      const parser = _sugar.when.call(self, true);
      expect(parser).to.be.a.parser;
    }
    // unless
    {
      expect(_sugar.unless).to.be.a("function");
      const parser = _sugar.unless.call(self, false);
      expect(parser).to.be.a.parser;
    }
    // filter
    {
      expect(_sugar.filter).to.be.a("function");
      const parser = _sugar.filter.call(self, _ => true);
      expect(parser).to.be.a.parser;
    }
  });
});

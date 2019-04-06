"use strict";

const { expect } = require("chai");

const { createDummyParser } = _test.helper;

describe("sugar", () => {
  it("should contain parser extension methods", () => {
    const self = createDummyParser();
    // option
    {
      expect(_sugar.option).to.be.a("function");
      const parser = _sugar.option.call(self, "foo");
      expect(parser).to.be.a.parser;
    }
    // optionMaybe
    {
      expect(_sugar.optionMaybe).to.be.a("function");
      const parser = _sugar.optionMaybe.call(self);
      expect(parser).to.be.a.parser;
    }
    // optional
    {
      expect(_sugar.optional).to.be.a("function");
      const parser = _sugar.optional.call(self);
      expect(parser).to.be.a.parser;
    }
    // between
    {
      expect(_sugar.between).to.be.a("function");
      const parser = _sugar.between.call(self, createDummyParser(), createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // many1
    {
      expect(_sugar.many1).to.be.a("function");
      const parser = _sugar.many1.call(self);
      expect(parser).to.be.a.parser;
    }
    // skipMany1
    {
      expect(_sugar.skipMany1).to.be.a("function");
      const parser = _sugar.skipMany1.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    {
      const parser = _sugar.skipMany1.call(self);
      expect(parser).to.be.a.parser;
    }
    // sepBy
    {
      expect(_sugar.sepBy).to.be.a("function");
      const parser = _sugar.sepBy.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // sepBy1
    {
      expect(_sugar.sepBy1).to.be.a("function");
      const parser = _sugar.sepBy1.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // sepEndBy
    {
      expect(_sugar.sepEndBy).to.be.a("function");
      const parser = _sugar.sepEndBy.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // sepEndBy1
    {
      expect(_sugar.sepEndBy1).to.be.a("function");
      const parser = _sugar.sepEndBy1.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // endBy
    {
      expect(_sugar.endBy).to.be.a("function");
      const parser = _sugar.endBy.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // endBy1
    {
      expect(_sugar.endBy1).to.be.a("function");
      const parser = _sugar.endBy1.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // count
    {
      expect(_sugar.count).to.be.a("function");
      const parser = _sugar.count.call(self, 42);
      expect(parser).to.be.a.parser;
    }
    // notFollowedBy
    {
      expect(_sugar.notFollowedBy).to.be.a("function");
      const parser = _sugar.notFollowedBy.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    {
      const parser = _sugar.notFollowedBy.call(self);
      expect(parser).to.be.a.parser;
    }
    // reduceManyTill
    {
      expect(_sugar.reduceManyTill).to.be.a("function");
      const parser = _sugar.reduceManyTill.call(self, createDummyParser(), (x, y) => x + y, "foo");
      expect(parser).to.be.a.parser;
    }
    // manyTill
    {
      expect(_sugar.manyTill).to.be.a("function");
      const parser = _sugar.manyTill.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // skipManyTill
    {
      expect(_sugar.skipManyTill).to.be.a("function");
      const parser = _sugar.skipManyTill.call(self, createDummyParser(), createDummyParser());
      expect(parser).to.be.a.parser;
    }
    {
      const parser = _sugar.skipManyTill.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
  });
});

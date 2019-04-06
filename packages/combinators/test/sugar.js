"use strict";

const { expect } = require("chai");

const { createDummyParser } = $testutil.helper;

describe("sugar", () => {
  it("should contain parser extension methods", () => {
    const self = createDummyParser();
    // option
    {
      expect($sugar.option).to.be.a("function");
      const parser = $sugar.option.call(self, "foo");
      expect(parser).to.be.a.parser;
    }
    // optionMaybe
    {
      expect($sugar.optionMaybe).to.be.a("function");
      const parser = $sugar.optionMaybe.call(self);
      expect(parser).to.be.a.parser;
    }
    // optional
    {
      expect($sugar.optional).to.be.a("function");
      const parser = $sugar.optional.call(self);
      expect(parser).to.be.a.parser;
    }
    // between
    {
      expect($sugar.between).to.be.a("function");
      const parser = $sugar.between.call(self, createDummyParser(), createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // many1
    {
      expect($sugar.many1).to.be.a("function");
      const parser = $sugar.many1.call(self);
      expect(parser).to.be.a.parser;
    }
    // skipMany1
    {
      expect($sugar.skipMany1).to.be.a("function");
      const parser = $sugar.skipMany1.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    {
      const parser = $sugar.skipMany1.call(self);
      expect(parser).to.be.a.parser;
    }
    // sepBy
    {
      expect($sugar.sepBy).to.be.a("function");
      const parser = $sugar.sepBy.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // sepBy1
    {
      expect($sugar.sepBy1).to.be.a("function");
      const parser = $sugar.sepBy1.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // sepEndBy
    {
      expect($sugar.sepEndBy).to.be.a("function");
      const parser = $sugar.sepEndBy.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // sepEndBy1
    {
      expect($sugar.sepEndBy1).to.be.a("function");
      const parser = $sugar.sepEndBy1.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // endBy
    {
      expect($sugar.endBy).to.be.a("function");
      const parser = $sugar.endBy.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // endBy1
    {
      expect($sugar.endBy1).to.be.a("function");
      const parser = $sugar.endBy1.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // count
    {
      expect($sugar.count).to.be.a("function");
      const parser = $sugar.count.call(self, 42);
      expect(parser).to.be.a.parser;
    }
    // notFollowedBy
    {
      expect($sugar.notFollowedBy).to.be.a("function");
      const parser = $sugar.notFollowedBy.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    {
      const parser = $sugar.notFollowedBy.call(self);
      expect(parser).to.be.a.parser;
    }
    // reduceManyTill
    {
      expect($sugar.reduceManyTill).to.be.a("function");
      const parser = $sugar.reduceManyTill.call(self, createDummyParser(), (x, y) => x + y, "foo");
      expect(parser).to.be.a.parser;
    }
    // manyTill
    {
      expect($sugar.manyTill).to.be.a("function");
      const parser = $sugar.manyTill.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // skipManyTill
    {
      expect($sugar.skipManyTill).to.be.a("function");
      const parser = $sugar.skipManyTill.call(self, createDummyParser(), createDummyParser());
      expect(parser).to.be.a.parser;
    }
    {
      const parser = $sugar.skipManyTill.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
  });
});

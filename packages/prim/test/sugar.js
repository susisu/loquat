"use strict";

const chai = require("chai");
const { expect } = chai;

const { createDummyParser } = $testutil.helpers;

describe("sugar", () => {
  it("should contain parser extension methods", () => {
    const self = createDummyParser();
    // map
    {
      expect($sugar.map).to.be.a("function");
      const parser = $sugar.map.call(self, x => x);
      expect(parser).to.be.a.parser;
    }
    // return
    {
      expect($sugar.return).to.be.a("function");
      const parser = $sugar.return.call(self, "foo");
      expect(parser).to.be.a.parser;
    }
    // ap
    {
      expect($sugar.ap).to.be.a("function");
      const parser = $sugar.ap.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // left
    {
      expect($sugar.left).to.be.a("function");
      const parser = $sugar.left.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // skip
    {
      expect($sugar.skip).to.be.a("function");
      const parser = $sugar.skip.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // right
    {
      expect($sugar.right).to.be.a("function");
      const parser = $sugar.right.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // bind
    {
      expect($sugar.bind).to.be.a("function");
      const parser = $sugar.bind.call(self, _ => createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // and
    {
      expect($sugar.and).to.be.a("function");
      const parser = $sugar.and.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // fail
    {
      expect($sugar.fail).to.be.a("function");
      const parser = $sugar.fail.call(self, "foo");
      expect(parser).to.be.a.parser;
    }
    // cont
    {
      expect($sugar.cont).to.be.a("function");
      const parser = $sugar.cont.call(self);
      expect(parser).to.be.a.parser;
    }
    // done
    {
      expect($sugar.done).to.be.a("function");
      const parser = $sugar.done.call(self);
      expect(parser).to.be.a.parser;
    }
    // or
    {
      expect($sugar.or).to.be.a("function");
      const parser = $sugar.or.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    // label
    {
      expect($sugar.label).to.be.a("function");
      const parser = $sugar.label.call(self, "foo");
      expect(parser).to.be.a.parser;
    }
    // hidden
    {
      expect($sugar.hidden).to.be.a("function");
      const parser = $sugar.hidden.call(self);
      expect(parser).to.be.a.parser;
    }
    // try
    {
      expect($sugar.try).to.be.a("function");
      const parser = $sugar.try.call(self);
      expect(parser).to.be.a.parser;
    }
    // lookAhead
    {
      expect($sugar.lookAhead).to.be.a("function");
      const parser = $sugar.lookAhead.call(self);
      expect(parser).to.be.a.parser;
    }
    // reduceMany
    {
      expect($sugar.reduceMany).to.be.a("function");
      const parser = $sugar.reduceMany.call(self, (accum, _) => accum, "foo");
      expect(parser).to.be.a.parser;
    }
    // many
    {
      expect($sugar.many).to.be.a("function");
      const parser = $sugar.many.call(self);
      expect(parser).to.be.a.parser;
    }
    // skipMany
    {
      expect($sugar.skipMany).to.be.a("function");
      const parser = $sugar.skipMany.call(self, createDummyParser());
      expect(parser).to.be.a.parser;
    }
    {
      const parser = $sugar.skipMany.call(self);
      expect(parser).to.be.a.parser;
    }
  });
});

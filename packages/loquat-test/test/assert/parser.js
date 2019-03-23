"use strict";

const { expect, AssertionError } = require("chai");

const { Parser, LazyParser } = _core;

const { createDummyParser } = _helper;

describe("parser", () => {
  it("should throw AssertionError if the object is not a parser", () => {
    const values = [
      null,
      undefined,
      "foo",
      42,
      true,
      {},
      () => {},
    ];
    for (const val of values) {
      expect(() => {
        expect(val).to.be.a.parser;
      }).to.throw(AssertionError);
    }
  });

  it("should not throw AssertionError if the object is a parser", () => {
    {
      const parser = createDummyParser();
      expect(() => {
        expect(parser).to.be.a.parser;
      }).to.not.throw(AssertionError);
    }
    {
      const parser = new LazyParser(() => createDummyParser());
      expect(() => {
        expect(parser).to.be.a.parser;
      }).to.not.throw(AssertionError);
    }
    {
      const TestParser = class extends Parser {
        constructor() {
          super();
        }
      };
      const parser = new TestParser();
      expect(() => {
        expect(parser).to.be.a.parser;
      }).to.not.throw(AssertionError);
    }
  });
});

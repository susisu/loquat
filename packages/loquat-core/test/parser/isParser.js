"use strict";

const { expect } = require("chai");

const { Parser, LazyParser, isParser } = _parser;

const { createDummyParser } = _test.helper;

describe("isParser", () => {
  it("should return true if the argument is an instance of `Parser`", () => {
    {
      const parser = createDummyParser();
      expect(isParser(parser)).to.be.true;
    }
    {
      const parser = new LazyParser(() => createDummyParser());
      expect(isParser(parser)).to.be.true;
    }
    {
      const TestParser = class extends Parser {
        constructor() {
          super();
        }
      };
      const parser = new TestParser();
      expect(isParser(parser)).to.be.true;
    }
  });

  it("should return false if the argument is not an instance of `Parser`", () => {
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
      expect(isParser(val)).to.be.false;
    }
  });
});

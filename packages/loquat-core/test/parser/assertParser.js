"use strict";

const { expect } = require("chai");

const { Parser, LazyParser, assertParser } = _parser;

const { createDummyParser } = _test.helper;

describe("assertParser", () => {
  it("should just return `undefined` if the argument is an instance of `Parser`", () => {
    {
      const parser = createDummyParser();
      expect(assertParser(parser)).to.be.undefined;
    }
    {
      const parser = new LazyParser(() => createDummyParser());
      expect(assertParser(parser)).to.be.undefined;
    }
    {
      const TestParser = class extends Parser {
        constructor() {
          super();
        }
      };
      const parser = new TestParser();
      expect(assertParser(parser)).to.be.undefined;
    }
  });

  it("should throw Error if the argument is not an instance of `Parser`", () => {
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
      expect(() => { assertParser(val); }).to.throw(Error, /not a parser/i);
    }
  });
});

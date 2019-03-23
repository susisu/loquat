"use strict";

const { expect } = require("chai");

const { AbstractParser, LazyParser, assertParser } = _parser;

const { createNoopParser } = _test.helper;

describe("assertParser", () => {
  it("should just return `undefined` if the argument is an instance of `AbstractParser`", () => {
    {
      const parser = createNoopParser();
      expect(assertParser(parser)).to.be.undefined;
    }
    {
      const parser = new LazyParser(() => createNoopParser());
      expect(assertParser(parser)).to.be.undefined;
    }
    {
      const TestParser = class extends AbstractParser {
        constructor() {
          super();
        }
      };
      const parser = new TestParser();
      expect(assertParser(parser)).to.be.undefined;
    }
  });

  it("should throw Error if the argument is not an instance of `AbstractParser`", () => {
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

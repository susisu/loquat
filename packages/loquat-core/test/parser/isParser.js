"use strict";

const { expect } = require("chai");

const { AbstractParser, Parser, LazyParser, isParser } = _parser;

describe("isParser", () => {
  it("should return true if the argument is an instance of `AbstractParser`", () => {
    {
      const parser = new Parser(() => {});
      expect(isParser(parser)).to.be.true;
    }
    {
      const parser = new LazyParser(() => new Parser(() => {}));
      expect(isParser(parser)).to.be.true;
    }
    {
      const TestParser = class extends AbstractParser {
        constructor() {
          super();
        }
      };
      const parser = new TestParser();
      expect(isParser(parser)).to.be.true;
    }
  });

  it("should return false if the argument is not an instance of `AbstractParser`", () => {
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

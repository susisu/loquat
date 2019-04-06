"use strict";

const { expect } = require("chai");

const { ParseError } = _error;
const { Result, Parser, StrictParser, LazyParser, isParser } = _parser;

describe("isParser", () => {
  it("should return true if the argument is an instance of `Parser`", () => {
    {
      const parser = new StrictParser(state => Result.efail(ParseError.unknown(state.pos)));
      expect(isParser(parser)).to.be.true;
    }
    {
      const parser = new LazyParser(() =>
        new StrictParser(state => Result.efail(ParseError.unknown(state.pos)))
      );
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

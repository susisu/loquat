"use strict";

const { expect } = require("chai");

const { ParseError } = _error;
const { Result, Parser, StrictParser, LazyParser, extendParser } = _parser;

describe("extendParser", () => {
  it("should extend `Parser.prototype`", () => {
    const extensions = {
      __test__foo: "foo",
      __test__bar: "bar",
      __test__baz: "baz",
    };
    for (const key of Object.keys(extensions)) {
      expect(Object.getOwnPropertyDescriptor(Parser.prototype, key)).to.be.undefined;
    }

    extendParser(extensions);

    for (const key of Object.keys(extensions)) {
      expect(Object.getOwnPropertyDescriptor(Parser.prototype, key)).to.deep.equal({
        value       : extensions[key],
        writable    : true,
        configurable: true,
        enumerable  : false,
      });
    }

    // can be accessed from parser objects
    {
      const parser = new StrictParser(state => Result.efail(ParseError.unknown(state.pos)));
      for (const key of Object.keys(extensions)) {
        expect(parser[key]).to.equal(extensions[key]);
      }
    }
    {
      const parser = new LazyParser(() =>
        new StrictParser(state => Result.efail(ParseError.unknown(state.pos)))
      );
      for (const key of Object.keys(extensions)) {
        expect(parser[key]).to.equal(extensions[key]);
      }
    }
  });
});

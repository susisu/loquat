"use strict";

const { expect } = require("chai");

const { Parser, LazyParser, extendParser } = _parser;

const { createDummyParser } = _test.helper;

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
      const parser = createDummyParser();
      for (const key of Object.keys(extensions)) {
        expect(parser[key]).to.equal(extensions[key]);
      }
    }
    {
      const parser = new LazyParser(() => createDummyParser());
      for (const key of Object.keys(extensions)) {
        expect(parser[key]).to.equal(extensions[key]);
      }
    }
  });
});

"use strict";

const { expect } = require("chai");

const { AbstractParser, Parser, LazyParser, extendParser } = _parser;

describe("extendParser", () => {
  it("should extend `AbstractParser.prototype`", () => {
    const extensions = {
      __test__foo: "foo",
      __test__bar: "bar",
      __test__baz: "baz",
    };
    for (const key of Object.keys(extensions)) {
      expect(Object.getOwnPropertyDescriptor(AbstractParser.prototype, key)).to.be.undefined;
    }

    extendParser(extensions);

    for (const key of Object.keys(extensions)) {
      expect(Object.getOwnPropertyDescriptor(AbstractParser.prototype, key)).to.deep.equal({
        value       : extensions[key],
        writable    : true,
        configurable: true,
        enumerable  : false,
      });
    }

    // can be accessed from parser objects
    {
      const parser = new Parser(() => {});
      for (const key of Object.keys(extensions)) {
        expect(parser[key]).to.equal(extensions[key]);
      }
    }
    {
      const parser = new LazyParser(() => new Parser(() => {}));
      for (const key of Object.keys(extensions)) {
        expect(parser[key]).to.equal(extensions[key]);
      }
    }
  });
});

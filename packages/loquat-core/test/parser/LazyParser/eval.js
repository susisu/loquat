"use strict";

const { expect } = require("chai");

const { LazyParser } = _parser;

const { createNoopParser } = _test.helper;

describe("#eval", () => {
  it("should evaluate the thunk then return a fully evaluated `StrictParser`", () => {
    const p = createNoopParser();
    {
      const parser = new LazyParser(() => p);
      const res = parser.eval();
      expect(res).to.equal(p);
    }
    // a multiply-nested LazyParser object is also evaluated to a StrictParser object
    {
      const parser = new LazyParser(() =>
        new LazyParser(() => p)
      );
      const res = parser.eval();
      expect(res).to.equal(p);
    }
  });

  it("should cache the evaluated result and return it if called next time", () => {
    {
      let evalCount = 0;
      const parser = new LazyParser(() => {
        evalCount += 1;
        return createNoopParser();
      });
      const resA = parser.eval();
      const resB = parser.eval();
      // the cached result is returned
      expect(evalCount).to.equal(1);
      expect(resA).to.equal(resB);
    }
    // all LazyParser objects are evaluated only once
    {
      let intermediateEvalCount = 0;
      let evalCount = 0;
      const parser = new LazyParser(() => {
        evalCount += 1;
        return new LazyParser(() => {
          intermediateEvalCount += 1;
          return createNoopParser();
        });
      });
      const resA = parser.eval();
      const resB = parser.eval();
      expect(intermediateEvalCount).to.equal(1);
      expect(evalCount).to.equal(1);
      expect(resA).to.equal(resB);
    }
    {
      let intermediateEvalCount = 0;
      const intermediateParser = new LazyParser(() => {
        intermediateEvalCount += 1;
        return createNoopParser();
      });
      let evalCount = 0;
      const parser = new LazyParser(() => {
        evalCount += 1;
        return intermediateParser;
      });
      // evaluate intermediate one first
      const intermediateRes = intermediateParser.eval();
      const resA = parser.eval();
      const resB = parser.eval();
      expect(intermediateEvalCount).to.equal(1);
      expect(evalCount).to.equal(1);
      expect(resA).to.equal(resB);
      expect(resA).to.equal(intermediateRes);
    }
  });

  it("should throw `TypeError` if invalid thunk found in the evaluation", () => {
    const invalidThunks = [
      null,
      undefined,
      "foo",
      6,
      true,
      {},
    ];
    for (const thunk of invalidThunks) {
      {
        const parser = new LazyParser(thunk);
        expect(() => { parser.eval(); }).to.throw(TypeError);
      }
      {
        const parser = new LazyParser(() => new LazyParser(thunk));
        expect(() => { parser.eval(); }).to.throw(TypeError);
      }
    }
  });

  it("should throw a `TypeError` if the final result is not a `StrictParser` object", () => {
    const invalidResults = [
      null,
      undefined,
      "foo",
      6,
      true,
      {},
      () => {},
    ];
    for (const res of invalidResults) {
      {
        const parser = new LazyParser(() => res);
        expect(() => { parser.eval(); }).to.throw(TypeError);
      }
      {
        const parser = new LazyParser(() => new LazyParser(() => res));
        expect(() => { parser.eval(); }).to.throw(TypeError);
      }
    }
  });
});

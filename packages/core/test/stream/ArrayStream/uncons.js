"use strict";

const { expect } = require("chai");

const { Config } = _parser;
const { ArrayStream } = _stream;

describe("#uncons", () => {
  it("should return an empty result if the current index is greater than the array length", () => {
    const config = new Config({ tabWidth: 4, unicode: true });
    // empty
    {
      const stream = new ArrayStream([], 0);
      const unconsed = stream.uncons(config);
      expect(unconsed).to.deep.equal({ empty: true });
    }
    // non-empty
    {
      const stream = new ArrayStream(["abc", "def", "ghi"], 3);
      const unconsed = stream.uncons(config);
      expect(unconsed).to.deep.equal({ empty: true });
    }
    {
      const stream = new ArrayStream(["abc", "def", "ghi"], 4);
      const unconsed = stream.uncons(config);
      expect(unconsed).to.deep.equal({ empty: true });
    }
  });

  it("should return a result containing the element at the current index and the rest", () => {
    const config = new Config({ tabWidth: 4, unicode: true });
    {
      const stream = new ArrayStream(["abc", "def", "ghi"], 0);
      const unconsed = stream.uncons(config);
      expect(unconsed.empty).to.be.false;
      expect(unconsed.head).to.equal("abc");
      expect(unconsed.tail).to.be.an.instanceOf(ArrayStream);
      expect(unconsed.tail.arr).to.deep.equal(["abc", "def", "ghi"]);
      expect(unconsed.tail.index).to.equal(1);
    }
    {
      const stream = new ArrayStream(["abc", "def", "ghi"], 1);
      const unconsed = stream.uncons(config);
      expect(unconsed.empty).to.be.false;
      expect(unconsed.head).to.equal("def");
      expect(unconsed.tail).to.be.an.instanceOf(ArrayStream);
      expect(unconsed.tail.arr).to.deep.equal(["abc", "def", "ghi"]);
      expect(unconsed.tail.index).to.equal(2);
    }
    {
      const stream = new ArrayStream(["abc", "def", "ghi"], 2);
      const unconsed = stream.uncons(config);
      expect(unconsed.empty).to.be.false;
      expect(unconsed.head).to.equal("ghi");
      expect(unconsed.tail).to.be.an.instanceOf(ArrayStream);
      expect(unconsed.tail.arr).to.deep.equal(["abc", "def", "ghi"]);
      expect(unconsed.tail.index).to.equal(3);
    }
  });
});

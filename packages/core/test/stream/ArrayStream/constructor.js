"use strict";

const { expect } = require("chai");

const { ArrayStream } = $stream;

describe(".constructor", () => {
  it("should create a new instance", () => {
    // empty array
    {
      const stream = new ArrayStream([], 0);
      expect(stream).to.be.an.instanceOf(ArrayStream);
      expect(stream.arr).to.deep.equal([]);
      expect(stream.index).to.equal(0);
    }
    // non-empty array
    {
      const stream = new ArrayStream(["abc", "def", "ghi"], 1);
      expect(stream).to.be.an.instanceOf(ArrayStream);
      expect(stream.arr).to.deep.equal(["abc", "def", "ghi"]);
      expect(stream.index).to.equal(1);
    }
  });
});

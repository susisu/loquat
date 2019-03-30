"use strict";

const { expect, assert } = require("chai");

const { zipWith } = _monad._internal;

describe("zipWith", () => {
  it("should zip two arrays with the given binary function", () => {
    {
      const arr = zipWith(
        (x, y) => assert.fail("expect function to not be called"),
        [],
        []
      );
      expect(arr).to.deep.equal([]);
    }
    {
      const arr = zipWith(
        (x, y) => x + y,
        [1, 2, 3],
        [4, 5, 6]
      );
      expect(arr).to.deep.equal([5, 7, 9]);
    }
    {
      const arr = zipWith(
        (x, y) => assert.fail("expect function to not be called"),
        [1, 2, 3],
        []
      );
      expect(arr).to.deep.equal([]);
    }
    {
      const arr = zipWith(
        (x, y) => assert.fail("expect function to not be called"),
        [],
        [1, 2, 3]
      );
      expect(arr).to.deep.equal([]);
    }
    {
      const arr = zipWith(
        (x, y) => x + y,
        [1, 2, 3],
        [4, 5]
      );
      expect(arr).to.deep.equal([5, 7]);
    }
    {
      const arr = zipWith(
        (x, y) => x + y,
        [1, 2],
        [4, 5, 6]
      );
      expect(arr).to.deep.equal([5, 7]);
    }
  });
});

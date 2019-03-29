"use strict";

const { expect } = require("chai");

const { zipWith } = _monad._internal;

describe(".zipWith(func, arrA, arrB)", () => {
  it("should zip two arrays `arrA' and `arrB' with a function `func'", () => {
    {
      const arr = zipWith(
        () => { throw new Error("unexpected call"); },
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
        () => { throw new Error("unexpected call"); },
        [1, 2, 3],
        []
      );
      expect(arr).to.deep.equal([]);
    }
    {
      const arr = zipWith(
        () => { throw new Error("unexpected call"); },
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

"use strict";

const { expect } = require("chai");

const { mkEqual } = _aux._internal;

describe("mkEqual", () => {
  it("should create an equality function", () => {
    {
      const equal = mkEqual(["foo", "bar"]);
      {
        const objA = { foo: 42, bar: true };
        const objB = { foo: 42, bar: true };
        expect(equal(objA, objB)).to.be.true;
      }
      {
        const objA = { foo: 42, bar: true };
        const objB = { foo: "baz", bar: true };
        expect(equal(objA, objB)).to.be.false;
      }
      {
        const objA = { foo: 42, bar: true };
        const objB = { foo: 42, bar: "baz" };
        expect(equal(objA, objB)).to.be.false;
      }
      {
        const objA = { foo: 42, bar: true, baz: "qux" };
        const objB = { foo: 42, bar: true };
        expect(equal(objA, objB)).to.be.true;
      }
    }
    {
      const equal = mkEqual([
        { name: "foo" },
        { name: "bar" },
      ]);
      {
        const objA = { foo: 42, bar: true };
        const objB = { foo: 42, bar: true };
        expect(equal(objA, objB)).to.be.true;
      }
      {
        const objA = { foo: 42, bar: true };
        const objB = { foo: "baz", bar: true };
        expect(equal(objA, objB)).to.be.false;
      }
      {
        const objA = { foo: 42, bar: true };
        const objB = { foo: 42, bar: "baz" };
        expect(equal(objA, objB)).to.be.false;
      }
      {
        const objA = { foo: 42, bar: true, baz: "qux" };
        const objB = { foo: 42, bar: true };
        expect(equal(objA, objB)).to.be.true;
      }
    }
  });

  it("should be able to customize equality", () => {
    {
      const caseInsensitiveEqual = (x, y) => x.toLowerCase() === y.toLowerCase();
      const equal = mkEqual([
        { name: "foo", eq: caseInsensitiveEqual },
        { name: "bar" },
      ]);
      {
        const objA = { foo: "A", bar: "B" };
        const objB = { foo: "A", bar: "B" };
        expect(equal(objA, objB)).to.be.true;
      }
      {
        const objA = { foo: "A", bar: "B" };
        const objB = { foo: "a", bar: "B" };
        expect(equal(objA, objB)).to.be.true;
      }
      {
        const objA = { foo: "A", bar: "B" };
        const objB = { foo: "A", bar: "b" };
        expect(equal(objA, objB)).to.be.false;
      }
      {
        const objA = { foo: "A", bar: "B" };
        const objB = { foo: "a", bar: "b" };
        expect(equal(objA, objB)).to.be.false;
      }
    }
  });

  it("should be able to override default equality function (===) for each properties", () => {
    const equal = mkEqual([
      { name: "foo", allowEqOverriding: true },
      { name: "bar", allowEqOverriding: true },
    ]);
    const caseInsensitiveEqual = (x, y) => x.toLowerCase() === y.toLowerCase();
    // not specified
    {
      const objA = { foo: "A", bar: "B" };
      const objB = { foo: "A", bar: "B" };
      expect(equal(objA, objB)).to.be.true;
    }
    {
      const objA = { foo: "A", bar: "B" };
      const objB = { foo: "a", bar: "B" };
      expect(equal(objA, objB)).to.be.false;
    }
    {
      const objA = { foo: "A", bar: "B" };
      const objB = { foo: "A", bar: "b" };
      expect(equal(objA, objB)).to.be.false;
    }
    {
      const objA = { foo: "A", bar: "B" };
      const objB = { foo: "a", bar: "b" };
      expect(equal(objA, objB)).to.be.false;
    }
    // specified for `foo`
    {
      const objA = { foo: "A", bar: "B" };
      const objB = { foo: "A", bar: "B" };
      expect(equal(objA, objB, caseInsensitiveEqual)).to.be.true;
    }
    {
      const objA = { foo: "A", bar: "B" };
      const objB = { foo: "a", bar: "B" };
      expect(equal(objA, objB, caseInsensitiveEqual)).to.be.true;
    }
    {
      const objA = { foo: "A", bar: "B" };
      const objB = { foo: "A", bar: "b" };
      expect(equal(objA, objB, caseInsensitiveEqual)).to.be.false;
    }
    {
      const objA = { foo: "A", bar: "B" };
      const objB = { foo: "a", bar: "b" };
      expect(equal(objA, objB, caseInsensitiveEqual)).to.be.false;
    }
    // specified for `bar`
    {
      const objA = { foo: "A", bar: "B" };
      const objB = { foo: "A", bar: "B" };
      expect(equal(objA, objB, undefined, caseInsensitiveEqual)).to.be.true;
    }
    {
      const objA = { foo: "A", bar: "B" };
      const objB = { foo: "a", bar: "B" };
      expect(equal(objA, objB, undefined, caseInsensitiveEqual)).to.be.false;
    }
    {
      const objA = { foo: "A", bar: "B" };
      const objB = { foo: "A", bar: "b" };
      expect(equal(objA, objB, undefined, caseInsensitiveEqual)).to.be.true;
    }
    {
      const objA = { foo: "A", bar: "B" };
      const objB = { foo: "a", bar: "b" };
      expect(equal(objA, objB, undefined, caseInsensitiveEqual)).to.be.false;
    }
    // specified for both
    {
      const objA = { foo: "A", bar: "B" };
      const objB = { foo: "A", bar: "B" };
      expect(equal(objA, objB, caseInsensitiveEqual, caseInsensitiveEqual)).to.be.true;
    }
    {
      const objA = { foo: "A", bar: "B" };
      const objB = { foo: "a", bar: "B" };
      expect(equal(objA, objB, caseInsensitiveEqual, caseInsensitiveEqual)).to.be.true;
    }
    {
      const objA = { foo: "A", bar: "B" };
      const objB = { foo: "A", bar: "b" };
      expect(equal(objA, objB, caseInsensitiveEqual, caseInsensitiveEqual)).to.be.true;
    }
    {
      const objA = { foo: "A", bar: "B" };
      const objB = { foo: "a", bar: "b" };
      expect(equal(objA, objB, caseInsensitiveEqual, caseInsensitiveEqual)).to.be.true;
    }
  });
});

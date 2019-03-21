"use strict";

const { expect } = require("chai");

const { mkInspect } = _aux._internal;

describe("mkInspect", () => {
  it("should create an inspector function", () => {
    const inspect = mkInspect("Test", ["foo", "bar", "baz"]);
    const obj = { foo: 42, bar: true, baz: "qux" };
    expect(inspect(obj)).to.equal("Test(foo = 42, bar = true, baz = \"qux\")");
  });
});

"use strict";

const { expect } = require("chai");

const { mkInspect } = $aux._internal;

describe("mkInspect", () => {
  it("should create an inspector function", () => {
    {
      const inspect = mkInspect("Test", ["foo", "bar", "baz"]);
      const obj = { foo: 42, bar: true, baz: "qux" };
      expect(inspect(obj)).to.equal("Test(foo = 42, bar = true, baz = \"qux\")");
    }
    {
      const inspect = mkInspect("Test", [
        { name: "foo" },
        { name: "bar" },
        { name: "baz" },
      ]);
      const obj = { foo: 42, bar: true, baz: "qux" };
      expect(inspect(obj)).to.equal("Test(foo = 42, bar = true, baz = \"qux\")");
    }
  });

  it("should be able to override default inspector function (show) for each properties", () => {
    const inspect = mkInspect("Test", [
      { name: "foo" },
      { name: "bar" },
      { name: "baz", inspector: x => x.toUpperCase() },
    ]);
    const obj = { foo: 42, bar: true, baz: "qux" };
    expect(inspect(obj)).to.equal("Test(foo = 42, bar = true, baz = QUX)");
  });
});

"use strict";

const { expect } = require("chai");

const { joinMessageStrings } = _error._internal;

describe("joinMessageStrings", () => {
  it("should return just a joined message if the given description is empty", () => {
    const strs = ["foo", "bar", "baz", "qux"];
    expect(joinMessageStrings(strs, "")).to.equal("foo, bar, baz or qux");
  });

  it("should return a joined message with short description", () => {
    const strs = ["foo", "bar", "baz", "qux"];
    expect(joinMessageStrings(strs, "expected")).to.equal("expected foo, bar, baz or qux");
  });
});

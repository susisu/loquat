"use strict";

const { expect } = require("chai");

const { joinMessageStrings } = _error._internal;

describe("joinMessageStrings", () => {
  it("should return just a joined message if the given description is empty", () => {
    const msgStrs = ["foo", "bar", "baz", "qux"];
    expect(joinMessageStrings(msgStrs, "")).to.equal("foo, bar, baz or qux");
  });

  it("should return a joined message with short description", () => {
    const msgStrs = ["foo", "bar", "baz", "qux"];
    expect(joinMessageStrings(msgStrs, "expected")).to.equal("expected foo, bar, baz or qux");
  });
});

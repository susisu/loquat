"use strict";

const { expect } = require("chai");

const { joinWithCommasOr } = _error._internal;

describe("joinWithCommasOr", () => {
  it("should return an empty string if the argument is empty", () => {
    expect(joinWithCommasOr([])).to.equal("");
  });

  it("should return the first element if the argument is singleton", () => {
    expect(joinWithCommasOr(["foo"])).to.equal("foo");
  });

  it("should return a string like \"A or B\" if the argument has only two elements", () => {
    expect(joinWithCommasOr(["foo", "bar"])).to.equal("foo or bar");
  });

  it("should return a joined commas and \"or\" if the argument has three or more elements", () => {
    const strs = ["foo", "bar", "baz", "qux"];
    expect(joinWithCommasOr(strs)).to.equal("foo, bar, baz or qux");
  });
});

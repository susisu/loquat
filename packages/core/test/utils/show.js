"use strict";

const { expect } = require("chai");

const { show } = $utils;

describe("show", () => {
  it("should return an escaped and double-quoted string if a string is given", () => {
    // empty
    expect(show("")).to.equal("\"\"");
    // single character
    expect(show("0")).to.equal("\"0\"");
    expect(show("A")).to.equal("\"A\"");
    expect(show("a")).to.equal("\"a\"");
    expect(show("\\")).to.equal("\"\\\\\"");
    expect(show("\"")).to.equal("\"\\\"\"");
    expect(show("\b")).to.equal("\"\\b\"");
    expect(show("\t")).to.equal("\"\\t\"");
    expect(show("\n")).to.equal("\"\\n\"");
    expect(show("\r")).to.equal("\"\\r\"");
    expect(show("\f")).to.equal("\"\\f\"");
    expect(show("\v")).to.equal("\"\\v\"");
    expect(show("\x00")).to.equal("\"\\x00\"");
    expect(show("\x1F")).to.equal("\"\\x1F\"");
    expect(show("\u3042")).to.equal("\"\u3042\"");
    expect(show("\u5b89")).to.equal("\"\u5b89\"");
    expect(show("\uD83C\uDF63")).to.equal("\"\uD83C\uDF63\"");
    // multiple characters
    {
      const str = "0\\9\"A\bZ\ta\nz\r'\f`\v\x00\x1F\u3042\u5b89\uD83C\uDF63";
      const exp = "\"0\\\\9\\\"A\\bZ\\ta\\nz\\r'\\f`\\v\\x00\\x1F\u3042\u5b89\uD83C\uDF63\"";
      expect(show(str)).to.equal(exp);
    }
  });

  it("should return the string representation of the given value", () => {
    expect(show(null)).to.equal("null");
    expect(show(undefined)).to.equal("undefined");
    expect(show(3.14)).to.equal("3.14");
    expect(show(true)).to.equal("true");
    expect(show({ toString() { return "foobar"; } })).to.equal("foobar");
  });

  it("should return a string containing the printed elements if an array is given", () => {
    const arr = [
      null,
      undefined,
      "0\\9\"A\bZ\ta\nz\r'\f`\v\x00\x1F\u3042\u5b89\uD83C\uDF63",
      3.14,
      true,
      { toString() { return "foobar"; } },
      Object.create(null),
      [1, "nyancat", false],
    ];
    expect(show(arr)).to.equal("[" + [
      "null",
      "undefined",
      "\"0\\\\9\\\"A\\bZ\\ta\\nz\\r'\\f`\\v\\x00\\x1F\u3042\u5b89\uD83C\uDF63\"",
      "3.14",
      "true",
      "foobar",
      "[object Object]",
      "[1, \"nyancat\", false]",
    ].join(", ") + "]");
  });

  it("should be ok even if the given object's `toString` is not defined", () => {
    expect(show(Object.create(null))).to.equal("[object Object]");
  });
});

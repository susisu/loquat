"use strict";

const { expect } = require("chai");

const { unconsString } = $utils;

describe("unconsString", () => {
  context("when `unicode` is true", () => {
    it("should return an empty result if the input is empty", () => {
      expect(unconsString("", true)).to.deep.equal({ empty: true });
    });

    it("should return a result containing the first character and the rest", () => {
      expect(unconsString("f", true)).to.deep.equal({ empty: false, head: "f", tail: "" });
      expect(unconsString("foo", true)).to.deep.equal({ empty: false, head: "f", tail: "oo" });

      // surrogate pairs
      expect(unconsString("\uD83C", true))
        .to.deep.equal({ empty: false, head: "\uD83C", tail: "" });
      expect(unconsString("\uD83Cfoo", true))
        .to.deep.equal({ empty: false, head: "\uD83C", tail: "foo" });
      expect(unconsString("\uD83C\uDF63", true))
        .to.deep.equal({ empty: false, head: "\uD83C\uDF63", tail: "" });
      expect(unconsString("\uD83C\uDF63foo", true))
        .to.deep.equal({ empty: false, head: "\uD83C\uDF63", tail: "foo" });

      // boundary cases
      expect(unconsString("\uD7FF\uDC00foo", true))
        .to.deep.equal({ empty: false, head: "\uD7FF", tail: "\uDC00foo" });
      expect(unconsString("\uDC00\uDC00foo", true))
        .to.deep.equal({ empty: false, head: "\uDC00", tail: "\uDC00foo" });
      expect(unconsString("\uD800\uDBFFfoo", true))
        .to.deep.equal({ empty: false, head: "\uD800", tail: "\uDBFFfoo" });
      expect(unconsString("\uD800\uE000foo", true))
        .to.deep.equal({ empty: false, head: "\uD800", tail: "\uE000foo" });
      expect(unconsString("\uD800\uDC00foo", true))
        .to.deep.equal({ empty: false, head: "\uD800\uDC00", tail: "foo" });
      expect(unconsString("\uDBFF\uDFFFfoo", true))
        .to.deep.equal({ empty: false, head: "\uDBFF\uDFFF", tail: "foo" });
    });
  });

  context("when `unicode` is false", () => {
    it("should return an empty result if the input is empty", () => {
      expect(unconsString("", false)).to.deep.equal({ empty: true });
    });

    it("should return a result containing the first character and the rest", () => {
      expect(unconsString("f", false)).to.deep.equal({ empty: false, head: "f", tail: "" });
      expect(unconsString("foo", false)).to.deep.equal({ empty: false, head: "f", tail: "oo" });

      // surrogate pairs
      expect(unconsString("\uD83C", false))
        .to.deep.equal({ empty: false, head: "\uD83C", tail: "" });
      expect(unconsString("\uD83Cfoo", false))
        .to.deep.equal({ empty: false, head: "\uD83C", tail: "foo" });
      expect(unconsString("\uD83C\uDF63", false))
        .to.deep.equal({ empty: false, head: "\uD83C", tail: "\uDF63" });
      expect(unconsString("\uD83C\uDF63foo", false))
        .to.deep.equal({ empty: false, head: "\uD83C", tail: "\uDF63foo" });
    });
  });
});

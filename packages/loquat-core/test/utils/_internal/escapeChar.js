"use strict";

const { expect } = require("chai");

const { escapeChar } = _utils._internal;

describe("escapeChar", () => {
  it("should escape the given character if it is a special character", () => {
    expect(escapeChar("\\")).to.equal("\\\\");
    expect(escapeChar("\"")).to.equal("\\\"");
    expect(escapeChar("\b")).to.equal("\\b");
    expect(escapeChar("\t")).to.equal("\\t");
    expect(escapeChar("\n")).to.equal("\\n");
    expect(escapeChar("\r")).to.equal("\\r");
    expect(escapeChar("\f")).to.equal("\\f");
    expect(escapeChar("\v")).to.equal("\\v");
    expect(escapeChar("\x00")).to.equal("\\x00");
    expect(escapeChar("\x1F")).to.equal("\\x1F");
  });

  it("should return the given character itself if it is not a special character", () => {
    const chars = "09AZaz'`\u3042\u5b89\uD83C\uDF63";
    for (const char of chars) {
      expect(escapeChar(char)).to.equal(char);
    }
  });
});

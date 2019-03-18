"use strict";

const { expect } = require("chai");

const { AbstractParser } = _parser;

describe("#parse", () => {
  it("should throw `Error` because not implemented", () => {
    const TestParser = class extends AbstractParser {
      constructor() {
        super();
      }
    };
    const parser = new TestParser();
    expect(() => {
      parser.parse("main", "input", "none", { tabWidth: 4, unicode: true });
    }).to.throw(Error, /not implemented/i);
    expect(() => {
      parser.parse("main", "input", undefined);
    }).to.throw(Error, /not implemented/i);
  });
});

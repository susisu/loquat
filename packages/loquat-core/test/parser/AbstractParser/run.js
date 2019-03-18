"use strict";

const { expect } = require("chai");

const { AbstractParser } = _parser;

describe("#run", () => {
  it("should throw `Error` because not implemented", () => {
    const TestParser = class extends AbstractParser {
      constructor() {
        super();
      }
    };
    const parser = new TestParser();
    expect(() => { parser.run(); }).to.throw(Error, /not implemented/i);
  });
});

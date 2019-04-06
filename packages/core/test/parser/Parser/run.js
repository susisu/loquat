"use strict";

const { expect } = require("chai");

const { Parser } = $parser;

describe("#run", () => {
  it("should throw `Error` because not implemented", () => {
    const TestParser = class extends Parser {
      constructor() {
        super();
      }
    };
    const parser = new TestParser();
    expect(() => { parser.run(); }).to.throw(Error, /not implemented/i);
  });
});

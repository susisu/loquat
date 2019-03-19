"use strict";

const { expect } = require("chai");

const { AbstractParser } = _parser;

describe(".constructor", () => {
  it("should throw `Error` if it is called as `new AbstractParser`", () => {
    expect(() => {
      new AbstractParser();
    }).to.throw(Error, /cannot create AbstractParser object/i);
  });

  it("should not throw `Error` if it is called via `super` from child constructor", () => {
    const TestParser = class extends AbstractParser {
      constructor() {
        super();
      }
    };
    expect(() => { new TestParser(); }).to.not.throw(Error);
  });
});

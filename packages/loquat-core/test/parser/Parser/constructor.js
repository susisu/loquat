"use strict";

const { expect } = require("chai");

const { Parser } = _parser;

describe(".constructor", () => {
  it("should throw `Error` if it is called as `new Parser`", () => {
    expect(() => {
      new Parser();
    }).to.throw(Error, /cannot create Parser object/i);
  });

  it("should not throw `Error` if it is called via `super` from child constructor", () => {
    const TestParser = class extends Parser {
      constructor() {
        super();
      }
    };
    expect(() => { new TestParser(); }).to.not.throw(Error);
  });
});

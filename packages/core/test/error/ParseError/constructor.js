"use strict";

const { expect } = require("chai");

const { ParseError } = _error;

describe(".constructor", () => {
  it("should throw `Error` if it is called as `new ParseError`", () => {
    expect(() => {
      new ParseError();
    }).to.throw(Error, /cannot create ParseError object directly/i);
  });

  it("should not throw `Error` if it is called via `super` from child constructor", () => {
    const TestParseError = class extends ParseError {
      constructor() {
        super();
      }
    };
    expect(() => { new TestParseError(); }).to.not.throw(Error);
  });
});

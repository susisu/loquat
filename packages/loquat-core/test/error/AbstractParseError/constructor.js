"use strict";

const { expect } = require("chai");

const { AbstractParseError } = _error;

describe(".constructor", () => {
  it("should throw `Error` if `new AbstractParseError` is called", () => {
    expect(() => {
      new AbstractParseError();
    }).to.throw(Error, /cannot create AbstractParseError object/i);
  });

  it("should not throw `Error` if it is called via `super` from child constructor", () => {
    const TestParseError = class extends AbstractParseError {
      constructor() {
        super();
      }
    };
    expect(() => { new TestParseError(); }).not.to.throw(Error);
  });
});

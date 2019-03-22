"use strict";

const { expect, AssertionError } = require("chai");

const { Config } = _core;

describe("equalConfigTo", () => {
  it("should throw AssertionError if the actual config is not equal to the expected one", () => {
    // tabWidth
    expect(() => {
      expect(new Config({ tabWidth: 4, unicode: true }))
        .to.be.an.equalConfigTo(new Config({ tabWidth: 8, unicode: true }));
    }).to.throw(AssertionError);
    // unicode
    expect(() => {
      expect(new Config({ tabWidth: 4, unicode: true }))
        .to.be.an.equalConfigTo(new Config({ tabWidth: 4, unicode: false }));
    }).to.throw(AssertionError);
    // both
    expect(() => {
      expect(new Config({ tabWidth: 4, unicode: true }))
        .to.be.an.equalConfigTo(new Config({ tabWidth: 8, unicode: false }));
    }).to.throw(AssertionError);
  });

  it("should not throw AssertionError if the actual config is equal to the expected one", () => {
    expect(() => {
      expect(new Config({ tabWidth: 4, unicode: true }))
        .to.be.an.equalConfigTo(new Config({ tabWidth: 4, unicode: true }));
    }).to.not.throw(AssertionError);
  });

  it("should throw AssertionError if the object is not a `Config` instance", () => {
    expect(() => {
      expect({})
        .to.be.an.equalConfigTo(new Config({ tabWidth: 4, unicode: true }));
    }).to.throw(AssertionError);
    expect(() => {
      expect({})
        .to.not.be.an.equalConfigTo(new Config({ tabWidth: 4, unicode: true }));
    }).to.throw(AssertionError);
  });
});

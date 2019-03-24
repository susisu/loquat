"use strict";

const { expect, AssertionError } = require("chai");

const { Config } = _core;

describe("equalConfigTo", () => {
  it("should throw AssertionError if the actual config is not equal to the expected one", () => {
    // tabWidth
    expect(() => {
      const act = new Config({ tabWidth: 4, unicode: true });
      const exp = new Config({ tabWidth: 8, unicode: true });
      expect(act).to.be.an.equalConfigTo(exp);
    }).to.throw(AssertionError, /Config/);
    // unicode
    expect(() => {
      const act = new Config({ tabWidth: 4, unicode: true });
      const exp = new Config({ tabWidth: 4, unicode: false });
      expect(act).to.be.an.equalConfigTo(exp);
    }).to.throw(AssertionError, /Config/);
    // both
    expect(() => {
      const act = new Config({ tabWidth: 4, unicode: true });
      const exp = new Config({ tabWidth: 8, unicode: false });
      expect(act).to.be.an.equalConfigTo(exp);
    }).to.throw(AssertionError, /Config/);
  });

  it("should not throw AssertionError if the actual config is equal to the expected one", () => {
    expect(() => {
      const act = new Config({ tabWidth: 4, unicode: true });
      const exp = new Config({ tabWidth: 4, unicode: true });
      expect(act).to.be.an.equalConfigTo(exp);
    }).to.not.throw(AssertionError);
  });

  it("should throw AssertionError if the object is not a `Config` instance", () => {
    const values = [
      null,
      undefined,
      "foo",
      42,
      true,
      {},
      () => {},
    ];
    const exp = new Config({ tabWidth: 4, unicode: true });
    for (const act of values) {
      expect(() => {
        expect(act).to.be.an.equalConfigTo(exp);
      }).to.throw(AssertionError, /Config/);
      expect(() => {
        expect(act).to.not.be.an.equalConfigTo(exp);
      }).to.throw(AssertionError, /Config/);
    }
  });
});

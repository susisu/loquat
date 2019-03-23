"use strict";

const { expect, AssertionError } = require("chai");

const { SourcePos, Config, State } = _core;

describe("equalStateTo", () => {
  it("should throw AssertionError if the actual state is not equal to the expected one", () => {
    // config
    expect(() => {
      const act = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      const exp = new State(
        new Config({ tabWidth: 8, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      expect(act).to.be.an.equalStateTo(exp);
    }).to.throw(AssertionError);
    // input
    expect(() => {
      const act = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      const exp = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "bar",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      expect(act).to.be.an.equalStateTo(exp);
    }).to.throw(AssertionError);
    // pos
    expect(() => {
      const act = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      const exp = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("lib", 497, 7, 29),
        "none"
      );
      expect(act).to.be.an.equalStateTo(exp);
    }).to.throw(AssertionError);
    // userState
    expect(() => {
      const act = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      const exp = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "some"
      );
      expect(act).to.be.an.equalStateTo(exp);
    }).to.throw(AssertionError);
    // all
    expect(() => {
      const act = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      const exp = new State(
        new Config({ tabWidth: 8, unicode: true }),
        "bar",
        new SourcePos("lib", 497, 7, 29),
        "some"
      );
      expect(act).to.be.an.equalStateTo(exp);
    }).to.throw(AssertionError);
    // customized equality
    const caseInsensitiveEqual = (x, y) => x.toLowerCase() === y.toLowerCase();
    expect(() => {
      const act = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      const exp = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "NONE"
      );
      expect(act).to.be.an.equalStateTo(exp, caseInsensitiveEqual);
    }).to.throw(AssertionError);
    expect(() => {
      const act = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      const exp = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "FOO",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      expect(act).to.be.an.equalStateTo(exp, undefined, caseInsensitiveEqual);
    }).to.throw(AssertionError);
  });

  it("should not throw AssertionError if the actual state is equal to the expected one", () => {
    expect(() => {
      const act = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      const exp = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      expect(act).to.be.an.equalStateTo(exp);
    }).to.not.throw(AssertionError);
    // customized equality
    const caseInsensitiveEqual = (x, y) => x.toLowerCase() === y.toLowerCase();
    expect(() => {
      const act = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      const exp = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "FOO",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      expect(act).to.be.an.equalStateTo(exp, caseInsensitiveEqual);
    }).to.not.throw(AssertionError);
    expect(() => {
      const act = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      const exp = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "NONE"
      );
      expect(act).to.be.an.equalStateTo(exp, undefined, caseInsensitiveEqual);
    }).to.not.throw(AssertionError);
    expect(() => {
      const act = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      const exp = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "FOO",
        new SourcePos("main", 496, 6, 28),
        "NONE"
      );
      expect(act).to.be.an.equalStateTo(exp, caseInsensitiveEqual, caseInsensitiveEqual);
    }).to.not.throw(AssertionError);
  });

  it("should throw AssertionError if the object is not a `State` instance", () => {
    const act = {};
    const exp = new State(
      new Config({ tabWidth: 4, unicode: true }),
      "foo",
      new SourcePos("main", 496, 6, 28),
      "none"
    );
    expect(() => {
      expect(act).to.be.an.equalStateTo(exp);
    }).to.throw(AssertionError);
    expect(() => {
      expect(act).to.not.be.an.equalStateTo(exp);
    }).to.throw(AssertionError);
  });
});

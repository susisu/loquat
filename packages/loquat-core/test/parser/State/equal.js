"use strict";

const chai = require("chai");
const { expect } = chai;

const { SourcePos } = _pos;
const { Config, State } = _parser;

describe(".equal", () => {
  it("should return true if two states are equal", () => {
    // use default arguments
    {
      const stateA = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      const stateB = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      expect(State.equal(stateA, stateB)).to.be.true;
      expect(State.equal(stateB, stateA)).to.be.true;
    }
    // specify undefined
    {
      const stateA = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      const stateB = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      expect(State.equal(stateA, stateB, undefined, undefined)).to.be.true;
      expect(State.equal(stateB, stateA, undefined, undefined)).to.be.true;
    }
    // specify functions
    {
      const stateA = new State(
        new Config({ tabWidth: 4, unicode: true }),
        ["foo", "bar", "baz"],
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      const stateB = new State(
        new Config({ tabWidth: 4, unicode: true }),
        ["foo", "bar", "baz"],
        new SourcePos("main", 496, 6, 28),
        "NONE"
      );
      const inputEqual = chai.util.eql;
      const userStateEqual = (strA, strB) => strA.toLowerCase() === strB.toLowerCase();
      expect(State.equal(stateA, stateB, inputEqual, userStateEqual)).to.be.true;
      expect(State.equal(stateB, stateA, inputEqual, userStateEqual)).to.be.true;
    }
  });

  it("should return false if two states are different", () => {
    // different config
    {
      const stateA = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      const stateB = new State(
        new Config({ tabWidth: 8, unicode: false }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      expect(State.equal(stateA, stateB)).to.be.false;
      expect(State.equal(stateB, stateA)).to.be.false;
    }
    // different input
    {
      const stateA = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      const stateB = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "FOO",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      expect(State.equal(stateA, stateB)).to.be.false;
      expect(State.equal(stateB, stateA)).to.be.false;
    }
    // different pos
    {
      const stateA = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      const stateB = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("lib", 497, 7, 29),
        "none"
      );
      expect(State.equal(stateA, stateB)).to.be.false;
      expect(State.equal(stateB, stateA)).to.be.false;
    }
    // different userState
    {
      const stateA = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      const stateB = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "NONE"
      );
      expect(State.equal(stateA, stateB)).to.be.false;
      expect(State.equal(stateB, stateA)).to.be.false;
    }
    // all
    {
      const stateA = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      const stateB = new State(
        new Config({ tabWidth: 8, unicode: false }),
        "FOO",
        new SourcePos("lib", 497, 7, 29),
        "NONE"
      );
      expect(State.equal(stateA, stateB)).to.be.false;
      expect(State.equal(stateB, stateA)).to.be.false;
    }
    // specify equal functions
    {
      const stateA = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      const stateB = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      const inputEqual = (_a, _b) => false;
      expect(State.equal(stateA, stateB, inputEqual)).to.be.false;
      expect(State.equal(stateB, stateA, inputEqual)).to.be.false;
    }
    {
      const stateA = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      const stateB = new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 496, 6, 28),
        "none"
      );
      const userStateEqual = (_a, _b) => false;
      expect(State.equal(stateA, stateB, undefined, userStateEqual)).to.be.false;
      expect(State.equal(stateB, stateA, undefined, userStateEqual)).to.be.false;
    }
  });
});

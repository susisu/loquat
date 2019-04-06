"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { Config, State } = _parser;

describe("#setConfig", () => {
  it("should create a new state with `config` updated", () => {
    const state = new State(
      new Config({ tabWidth: 4, unicode: true }),
      "foo",
      new SourcePos("main", 496, 6, 28),
      "none"
    );
    const copy = state.setConfig(new Config({ tabWidth: 8, unicode: false }));
    expect(copy).to.not.equal(state);
    expect(State.equal(copy, new State(
      new Config({ tabWidth: 8, unicode: false }),
      "foo",
      new SourcePos("main", 496, 6, 28),
      "none"
    ))).to.be.true;
  });
});

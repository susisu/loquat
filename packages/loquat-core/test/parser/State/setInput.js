"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { Config, State } = _parser;

describe("#setInput", () => {
  it("should create a new state with `input` updated", () => {
    const state = new State(
      new Config({ tabWidth: 4, unicode: true }),
      "foo",
      new SourcePos("nyancat", 6, 28),
      "none"
    );
    const copy = state.setInput("bar");
    expect(copy).to.be.an.instanceOf(State);
    expect(copy).not.to.equal(state);
    expect(State.equal(
      copy,
      new State(
        new Config({ tabWidth: 4, unicode: true }),
        "bar",
        new SourcePos("nyancat", 6, 28),
        "none"
      )
    )).to.be.true;
  });
});

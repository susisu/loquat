"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { Config, State } = _parser;

describe("#setInput", () => {
  it("should create a new state with `input` updated", () => {
    const state = new State(
      new Config({ tabWidth: 4, unicode: true }),
      "foo",
      new SourcePos("main", 496, 6, 28),
      "none"
    );
    const copy = state.setInput("bar");
    expect(copy).to.not.equal(state);
    expect(copy).to.be.an.equalStateTo(new State(
      new Config({ tabWidth: 4, unicode: true }),
      "bar",
      new SourcePos("main", 496, 6, 28),
      "none"
    ));
  });
});

"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { Config, State } = _parser;

describe("#setPosition", () => {
  it("should a new state with `pos` updated", () => {
    const state = new State(
      new Config({ tabWidth: 4, unicode: true }),
      "foo",
      new SourcePos("main", 496, 6, 28),
      "none"
    );
    const copy = state.setPosition(new SourcePos("lib", 506, 7, 29));
    expect(copy).to.not.equal(state);
    expect(copy).to.be.an.equalStateTo(new State(
      new Config({ tabWidth: 4, unicode: true }),
      "foo",
      new SourcePos("lib", 506, 7, 29),
      "none"
    ));
  });
});

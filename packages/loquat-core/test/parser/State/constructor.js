"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { Config, State } = _parser;

describe(".constructor", () => {
  it("should create a new `State` instance", () => {
    const state = new State(
      new Config({ tabWidth: 4, unicode: true }),
      "input",
      new SourcePos("main", 496, 6, 28),
      "none"
    );
    expect(state).to.be.an.instanceOf(State);
    expect(state.config).to.be.an.equalConfigTo(new Config({ tabWidth: 4, unicode: true }));
    expect(state.input).to.equal("input");
    expect(SourcePos.equal(state.pos, new SourcePos("main", 496, 6, 28))).to.be.true;
    expect(state.userState).to.equal("none");
  });
});

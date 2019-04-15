"use strict";

const { expect } = require("chai");

const { SourcePos } = $pos;
const { Config, State } = $parser;

describe(".constructor", () => {
  it("should create a new `State` instance", () => {
    const state = new State(
      new Config({ tabWidth: 4, unicode: true }),
      "input",
      new SourcePos("main", 6, 28),
      "none"
    );
    expect(state).to.be.an.instanceOf(State);
    expect(Config.equal(state.config, new Config({ tabWidth: 4, unicode: true }))).to.be.true;
    expect(state.input).to.equal("input");
    expect(SourcePos.equal(state.pos, new SourcePos("main", 6, 28))).to.be.true;
    expect(state.userState).to.equal("none");
  });
});

"use strict";

const { expect } = require("chai");

const { SourcePos } = _pos;
const { Config, State } = _parser;

describe("#setUserState", () => {
  it("should create a new state with `userState` updated", () => {
    const state = new State(
      new Config({ tabWidth: 4, unicode: true }),
      "foo",
      new SourcePos("main", 6, 28),
      "none"
    );
    const copy = state.setUserState("some");
    expect(copy).to.be.an.instanceOf(State);
    expect(copy).to.not.equal(state);
    expect(State.equal(
      copy,
      new State(
        new Config({ tabWidth: 4, unicode: true }),
        "foo",
        new SourcePos("main", 6, 28),
        "some"
      )
    )).to.be.true;
  });
});

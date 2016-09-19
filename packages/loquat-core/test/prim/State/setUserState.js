/*
 * loquat test / prim.State#setUserState()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("pos.js");
const { Config, State } = require("prim.js");

describe("#setUserState(pos)", () => {
    it("should a copy of the state, with specified `pos'", () => {
        let state = new State(
            new Config({ tabWidth: 4, useCodePoint: true }),
            "foobar",
            new SourcePos("nyancat", 496, 28),
            "none"
        );
        let copy = state.setUserState("some");
        expect(copy).not.to.equal(state);
        expect(State.equal(
            copy,
            new State(
                new Config({ tabWidth: 4, useCodePoint: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "some"
            )
        )).to.be.true;
    });
});

/*
 * loquat-core test / parser.State#setUserState()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos = _pos.SourcePos;

const Config = _parser.Config;
const State  = _parser.State;

describe("#setUserState(pos)", () => {
    it("should a copy of the state, with specified `pos'", () => {
        const state = new State(
            new Config({ tabWidth: 4, unicode: true }),
            "foobar",
            new SourcePos("nyancat", 496, 28),
            "none"
        );
        const copy = state.setUserState("some");
        expect(copy).not.to.equal(state);
        expect(State.equal(
            copy,
            new State(
                new Config({ tabWidth: 4, unicode: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "some"
            )
        )).to.be.true;
    });
});

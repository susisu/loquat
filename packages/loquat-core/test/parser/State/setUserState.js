/*
 * loquat-core test / parser.State#setUserState()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const _pos = require("pos.js");
const SourcePos = _pos.SourcePos;

const _parser = require("parser.js");
const Config = _parser.Config;
const State  = _parser.State;

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

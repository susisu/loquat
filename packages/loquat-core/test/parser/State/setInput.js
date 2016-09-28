/*
 * loquat-core test / parser.State#setInput()
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

describe("#setInput(input)", () => {
    it("should a copy of the state, with specified `input'", () => {
        let state = new State(
            new Config({ tabWidth: 4, useCodePoint: true }),
            "foo",
            new SourcePos("nyancat", 496, 28),
            "none"
        );
        let copy = state.setInput("bar");
        expect(copy).not.to.equal(state);
        expect(State.equal(
            copy,
            new State(
                new Config({ tabWidth: 4, useCodePoint: true }),
                "bar",
                new SourcePos("nyancat", 496, 28),
                "none"
            )
        )).to.be.true;
    });
});

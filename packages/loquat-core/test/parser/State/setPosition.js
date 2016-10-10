/*
 * loquat-core test / parser.State#setPosition()
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

describe("#setPosition(pos)", () => {
    it("should a copy of the state, with specified `pos'", () => {
        let state = new State(
            new Config({ tabWidth: 4, unicode: true }),
            "foobar",
            new SourcePos("nyan", 496, 28),
            "none"
        );
        let copy = state.setPosition(new SourcePos("cat", 6, 6));
        expect(copy).not.to.equal(state);
        expect(State.equal(
            copy,
            new State(
                new Config({ tabWidth: 4, unicode: true }),
                "foobar",
                new SourcePos("cat", 6, 6),
                "none"
            )
        )).to.be.true;
    });
});

/*
 * loquat-core test / parser.State#setPosition()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("pos.js");
const { Config, State } = require("parser.js");

describe("#setPosition(pos)", () => {
    it("should a copy of the state, with specified `pos'", () => {
        let state = new State(
            new Config({ tabWidth: 4, useCodePoint: true }),
            "foobar",
            new SourcePos("nyan", 496, 28),
            "none"
        );
        let copy = state.setPosition(new SourcePos("cat", 6, 6));
        expect(copy).not.to.equal(state);
        expect(State.equal(
            copy,
            new State(
                new Config({ tabWidth: 4, useCodePoint: true }),
                "foobar",
                new SourcePos("cat", 6, 6),
                "none"
            )
        )).to.be.true;
    });
});

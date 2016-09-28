/*
 * loquat-core test / parser.State#setConfig()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("pos.js");
const { Config, State } = require("parser.js");

describe("#setConfig(config)", () => {
    it("should a copy of the state, with specified `config'", () => {
        let state = new State(
            new Config({ tabWidth: 4, useCodePoint: true }),
            "foo",
            new SourcePos("nyancat", 496, 28),
            "none"
        );
        let copy = state.setConfig(new Config({ tabWidth: 8, useCodePoint: false }));
        expect(copy).not.to.equal(state);
        expect(State.equal(
            copy,
            new State(
                new Config({ tabWidth: 8, useCodePoint: false }),
                "foo",
                new SourcePos("nyancat", 496, 28),
                "none"
            )
        )).to.be.true;
    });
});

/*
 * loquat-core test / parser.State#setConfig()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos = _pos.SourcePos;

const Config = _parser.Config;
const State  = _parser.State;

describe("#setConfig(config)", () => {
    it("should a copy of the state, with specified `config'", () => {
        let state = new State(
            new Config({ tabWidth: 4, unicode: true }),
            "foo",
            new SourcePos("nyancat", 496, 28),
            "none"
        );
        let copy = state.setConfig(new Config({ tabWidth: 8, unicode: false }));
        expect(copy).not.to.equal(state);
        expect(State.equal(
            copy,
            new State(
                new Config({ tabWidth: 8, unicode: false }),
                "foo",
                new SourcePos("nyancat", 496, 28),
                "none"
            )
        )).to.be.true;
    });
});

/*
 * loquat test / parser.State constructor()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("pos.js");
const { Config, State } = require("parser.js");

describe("constructor(config, input, pos, userState)", () => {
    it("should create a new `State' instance", () => {
        // use default argument
        {
            let state = new State(
                new Config({ tabWidth: 4, useCodePoint: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28)
            );
            expect(state).to.be.an.instanceOf(State);
            expect(Config.equal(
                state.config,
                new Config({ tabWidth: 4, useCodePoint: true })
            )).to.be.true;
            expect(state.input).to.equal("foobar");
            expect(SourcePos.equal(
                state.pos,
                new SourcePos("nyancat", 496, 28)
            )).to.be.true;
            expect(state.userState).to.equal(undefined);
        }
        // specify userState
        {
            let state = new State(
                new Config({ tabWidth: 4, useCodePoint: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "user-defined state"
            );
            expect(state).to.be.an.instanceOf(State);
            expect(Config.equal(
                state.config,
                new Config({ tabWidth: 4, useCodePoint: true })
            )).to.be.true;
            expect(state.input).to.equal("foobar");
            expect(SourcePos.equal(
                state.pos,
                new SourcePos("nyancat", 496, 28)
            )).to.be.true;
            expect(state.userState).to.equal("user-defined state");
        }
    });
});

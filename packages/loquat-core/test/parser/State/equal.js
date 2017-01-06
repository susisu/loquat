/*
 * loquat-core test / parser.State.equal()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos = _pos.SourcePos;

const Config = _parser.Config;
const State  = _parser.State;

describe(".equal(stateA, stateB, inputEqual = undefined, userStateEqual = undefined)", () => {
    it("should return `true' if two states are equal", () => {
        // use default arguments
        {
            const stateA = new State(
                new Config({ tabWidth: 4, unicode: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            const stateB = new State(
                new Config({ tabWidth: 4, unicode: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            expect(State.equal(stateA, stateB)).to.be.true;
        }
        // specify undefined
        {
            const stateA = new State(
                new Config({ tabWidth: 4, unicode: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            const stateB = new State(
                new Config({ tabWidth: 4, unicode: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            expect(State.equal(stateA, stateB, undefined, undefined)).to.be.true;
        }
        // specify functions
        {
            const stateA = new State(
                new Config({ tabWidth: 4, unicode: true }),
                ["foo", "bar", "baz"],
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            const stateB = new State(
                new Config({ tabWidth: 4, unicode: true }),
                ["foo", "bar", "baz"],
                new SourcePos("nyancat", 496, 28),
                "NONE"
            );
            const inputEqual = (arrA, arrB) => (arrA.length === arrB.length
                && arrA.every((elemA, i) => elemA === arrB[i]));
            const userStateEqual = (strA, strB) => strA.toLowerCase() === strB.toLowerCase();
            expect(State.equal(stateA, stateB, inputEqual, userStateEqual)).to.be.true;
        }
    });

    it("should return `false' if two states are different", () => {
        // different config
        {
            const stateA = new State(
                new Config({ tabWidth: 4, unicode: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            const stateB = new State(
                new Config({ tabWidth: 8, unicode: false }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            expect(State.equal(stateA, stateB)).to.be.false;
        }
        // different input
        {
            const stateA = new State(
                new Config({ tabWidth: 4, unicode: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            const stateB = new State(
                new Config({ tabWidth: 4, unicode: true }),
                "FOOBAR",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            expect(State.equal(stateA, stateB)).to.be.false;
        }
        // different pos
        {
            const stateA = new State(
                new Config({ tabWidth: 4, unicode: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            const stateB = new State(
                new Config({ tabWidth: 4, unicode: true }),
                "foobar",
                new SourcePos("nyancat", 6, 28),
                "none"
            );
            expect(State.equal(stateA, stateB)).to.be.false;
        }
        // different userState
        {
            const stateA = new State(
                new Config({ tabWidth: 4, unicode: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            const stateB = new State(
                new Config({ tabWidth: 4, unicode: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "NONE"
            );
            expect(State.equal(stateA, stateB)).to.be.false;
        }
        // all
        {
            const stateA = new State(
                new Config({ tabWidth: 4, unicode: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            const stateB = new State(
                new Config({ tabWidth: 8, unicode: false }),
                "FOOBAR",
                new SourcePos("nyancat", 6, 28),
                "NONE"
            );
            expect(State.equal(stateA, stateB)).to.be.false;
        }
        // specify equal functions
        {
            const stateA = new State(
                new Config({ tabWidth: 4, unicode: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            const stateB = new State(
                new Config({ tabWidth: 4, unicode: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            const inputEqual = () => false;
            expect(State.equal(stateA, stateB, inputEqual)).to.be.false;
        }
        {
            const stateA = new State(
                new Config({ tabWidth: 4, unicode: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            const stateB = new State(
                new Config({ tabWidth: 4, unicode: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            const userStateEqual = () => false;
            expect(State.equal(stateA, stateB, undefined, userStateEqual)).to.be.false;
        }
    });
});

/*
 * loquat-core test / parser.State.equal()
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

describe(".equal(stateA, stateB, inputEqual = undefined, userStateEqual = undefined)", () => {
    it("should return `true' if two states are equal", () => {
        // use default arguments
        {
            let stateA = new State(
                new Config({ tabWidth: 4, useCodePoint: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            let stateB = new State(
                new Config({ tabWidth: 4, useCodePoint: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            expect(State.equal(stateA, stateB)).to.be.true;
        }
        // specify undefined
        {
            let stateA = new State(
                new Config({ tabWidth: 4, useCodePoint: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            let stateB = new State(
                new Config({ tabWidth: 4, useCodePoint: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            expect(State.equal(stateA, stateB, undefined, undefined)).to.be.true;
        }
        // specify functions
        {
            let stateA = new State(
                new Config({ tabWidth: 4, useCodePoint: true }),
                ["foo", "bar", "baz"],
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            let stateB = new State(
                new Config({ tabWidth: 4, useCodePoint: true }),
                ["foo", "bar", "baz"],
                new SourcePos("nyancat", 496, 28),
                "NONE"
            );
            let inputEqual = (arrA, arrB) => (arrA.length === arrB.length
                && arrA.every((elemA, i) => elemA === arrB[i]));
            let userStateEqual = (strA, strB) => strA.toLowerCase() === strB.toLowerCase();
            expect(State.equal(stateA, stateB, inputEqual, userStateEqual)).to.be.true;
        }
    });

    it("should return `false' if two states are different", () => {
        // different config
        {
            let stateA = new State(
                new Config({ tabWidth: 4, useCodePoint: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            let stateB = new State(
                new Config({ tabWidth: 8, useCodePoint: false }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            expect(State.equal(stateA, stateB)).to.be.false;
        }
        // different input
        {
            let stateA = new State(
                new Config({ tabWidth: 4, useCodePoint: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            let stateB = new State(
                new Config({ tabWidth: 4, useCodePoint: true }),
                "FOOBAR",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            expect(State.equal(stateA, stateB)).to.be.false;
        }
        // different pos
        {
            let stateA = new State(
                new Config({ tabWidth: 4, useCodePoint: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            let stateB = new State(
                new Config({ tabWidth: 4, useCodePoint: true }),
                "foobar",
                new SourcePos("nyancat", 6, 28),
                "none"
            );
            expect(State.equal(stateA, stateB)).to.be.false;
        }
        // different userState
        {
            let stateA = new State(
                new Config({ tabWidth: 4, useCodePoint: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            let stateB = new State(
                new Config({ tabWidth: 4, useCodePoint: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "NONE"
            );
            expect(State.equal(stateA, stateB)).to.be.false;
        }
        // all
        {
            let stateA = new State(
                new Config({ tabWidth: 4, useCodePoint: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            let stateB = new State(
                new Config({ tabWidth: 8, useCodePoint: false }),
                "FOOBAR",
                new SourcePos("nyancat", 6, 28),
                "NONE"
            );
            expect(State.equal(stateA, stateB)).to.be.false;
        }
        // specify equal functions
        {
            let stateA = new State(
                new Config({ tabWidth: 4, useCodePoint: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            let stateB = new State(
                new Config({ tabWidth: 4, useCodePoint: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            let inputEqual = () => false;
            expect(State.equal(stateA, stateB, inputEqual)).to.be.false;
        }
        {
            let stateA = new State(
                new Config({ tabWidth: 4, useCodePoint: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            let stateB = new State(
                new Config({ tabWidth: 4, useCodePoint: true }),
                "foobar",
                new SourcePos("nyancat", 496, 28),
                "none"
            );
            let userStateEqual = () => false;
            expect(State.equal(stateA, stateB, undefined, userStateEqual)).to.be.false;
        }
    });
});

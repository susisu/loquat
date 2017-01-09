/*
 * loquat-prim test / prim.mplus()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos        = _core.SourcePos;
const ErrorMessageType = _core.ErrorMessageType;
const ErrorMessage     = _core.ErrorMessage;
const ParseError       = _core.ParseError;
const Config           = _core.Config;
const State            = _core.State;
const Result           = _core.Result;
const Parser           = _core.Parser;
const assertParser     = _core.assertParser;

const mzero = _prim.mzero;
const mplus = _prim.mplus;

describe(".mplus(parserA, parserB)", () => {
    it("should return a parser that runs `parserA', and if the result is empty error, runs `parserB'", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        const stateA = new State(
            new Config({ tabWidth: 4 }),
            "restA",
            new SourcePos("foobar", 1, 2),
            "someA"
        );
        const errA = new ParseError(
            new SourcePos("foobar", 1, 2),
            [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
        );
        const stateB = new State(
            new Config({ tabWidth: 2 }),
            "restB",
            new SourcePos("foobar", 1, 2),
            "someB"
        );
        const errB = new ParseError(
            new SourcePos("foobar", 1, 2),
            [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
        );
        // csuc
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);
            });
            const parserB = new Parser(() => { throw new Error("unexpected call"); });
            const composed = mplus(parserA, parserB);
            assertParser(composed);
            const res = composed.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errA, "nyan", stateA)
            )).to.be.true;
        }
        // cerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(errA);
            });
            const parserB = new Parser(() => { throw new Error("unexpected call"); });
            const composed = mplus(parserA, parserB);
            assertParser(composed);
            const res = composed.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errA)
            )).to.be.true;
        }
        // esuc
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });
            const parserB = new Parser(() => { throw new Error("unexpected call"); });
            const composed = mplus(parserA, parserB);
            assertParser(composed);
            const res = composed.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(errA, "nyan", stateA)
            )).to.be.true;
        }
        // eerr, csuc
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(errA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errB, "cat", stateB);
            });
            const composed = mplus(parserA, parserB);
            assertParser(composed);
            const res = composed.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errB, "cat", stateB)
            )).to.be.true;
        }
        // eerr, cerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(errA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(errB);
            });
            const composed = mplus(parserA, parserB);
            assertParser(composed);
            const res = composed.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errB)
            )).to.be.true;
        }
        // eerr, esuc
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(errA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errB, "cat", stateB);
            });
            const composed = mplus(parserA, parserB);
            assertParser(composed);
            const res = composed.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(ParseError.merge(errA, errB), "cat", stateB)
            )).to.be.true;
        }
        // eerr, eerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(errA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(errB);
            });
            const composed = mplus(parserA, parserB);
            assertParser(composed);
            const res = composed.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(ParseError.merge(errA, errB))
            )).to.be.true;
        }
    });

    it("should obey the monoid laws", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        // (u `mplus` v) `mplus` w = u `mplus` (v `mplus` w)
        {
            const stateU = new State(
                new Config({ tabWidth: 4 }),
                "restU",
                new SourcePos("foobar", 1, 2),
                "someU"
            );
            const errU = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testU")]
            );
            const us = [
                new Parser(() => Result.csuc(errU, "u", stateU)),
                new Parser(() => Result.cerr(errU)),
                new Parser(() => Result.esuc(errU, "u", stateU)),
                new Parser(() => Result.eerr(errU))
            ];

            const stateV = new State(
                new Config({ tabWidth: 4 }),
                "restV",
                new SourcePos("foobar", 1, 2),
                "someV"
            );
            const errV = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testV")]
            );
            const vs = [
                new Parser(() => Result.csuc(errV, "u", stateV)),
                new Parser(() => Result.cerr(errV)),
                new Parser(() => Result.esuc(errV, "u", stateV)),
                new Parser(() => Result.eerr(errV))
            ];

            const stateW = new State(
                new Config({ tabWidth: 4 }),
                "restW",
                new SourcePos("foobar", 1, 2),
                "someW"
            );
            const errW = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testW")]
            );
            const ws = [
                new Parser(() => Result.csuc(errW, "u", stateW)),
                new Parser(() => Result.cerr(errW)),
                new Parser(() => Result.esuc(errW, "u", stateW)),
                new Parser(() => Result.eerr(errW))
            ];

            for (const u of us) {
                for (const v of vs) {
                    for (const w of ws) {
                        expect(Result.equal(
                            mplus(mplus(u, v), w).run(initState),
                            mplus(u, mplus(v, w)).run(initState)
                        )).to.be.true;
                    }
                }
            }
        }
        // parser `mplus` mzero = mzero `mplus` parser = parser
        {
            const finalState = new State(
                new Config({ tabWidth: 4 }),
                "rest",
                new SourcePos("foobar", 1, 2),
                "some"
            );
            const err = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
            );
            const parsers = [
                new Parser(() => Result.csuc(err, "nyancat", finalState)),
                new Parser(() => Result.cerr(err)),
                new Parser(() => Result.esuc(err, "nyancat", finalState)),
                new Parser(() => Result.eerr(err))
            ];
            for (const parser of parsers) {
                expect(Result.equal(
                    mplus(parser, mzero).run(initState),
                    parser.run(initState)
                )).to.be.true;

                expect(Result.equal(
                    mplus(mzero, parser).run(initState),
                    parser.run(initState)
                )).to.be.true;
            }
        }
    });
});

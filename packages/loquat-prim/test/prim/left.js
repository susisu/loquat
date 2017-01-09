/*
 * loquat-prim test / prim.left()
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

const left = _prim.left;

describe(".left(parserA, parserB)", () => {
    it("should return a parser that runs `parserA' and `parseB', and use the resultant value of `parserA'", () => {
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
        // csuc, csuc
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);
            });
            const parserB = new Parser(state => {
                expect(state).to.equal(stateA);
                return Result.csuc(errB, "cat", stateB);
            });
            const composed = left(parserA, parserB);
            assertParser(composed);
            const res = composed.run(initState);
            expect(Result.equal(res, Result.csuc(errB, "nyan", stateB))).to.be.true;
        }
        // csuc, cerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);

            });
            const parserB = new Parser(state => {
                expect(state).to.equal(stateA);
                return Result.cerr(errB);
            });
            const composed = left(parserA, parserB);
            assertParser(composed);
            const res = composed.run(initState);
            expect(Result.equal(res, Result.cerr(errB))).to.be.true;
        }
        // csuc, esuc
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);
            });
            const parserB = new Parser(state => {
                expect(state).to.equal(stateA);
                return Result.esuc(errB, "cat", stateB);
            });
            const composed = left(parserA, parserB);
            assertParser(composed);
            const res = composed.run(initState);
            expect(Result.equal(res, Result.csuc(ParseError.merge(errA, errB), "nyan", stateB))).to.be.true;
        }
        // csuc, eerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);
            });
            const parserB = new Parser(state => {
                expect(state).to.equal(stateA);
                return Result.eerr(errB);
            });
            const composed = left(parserA, parserB);
            assertParser(composed);
            const res = composed.run(initState);
            expect(Result.equal(res, Result.cerr(ParseError.merge(errA, errB)))).to.be.true;
        }
        // cerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(errA);
            });
            const parserB = new Parser(() => {
                throw new Error("unexpected call");
            });
            const composed = left(parserA, parserB);
            assertParser(composed);
            const res = composed.run(initState);
            expect(Result.equal(res, Result.cerr(errA))).to.be.true;
        }
        // esuc, csuc
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });
            const parserB = new Parser(state => {
                expect(state).to.equal(stateA);
                return Result.csuc(errB, "cat", stateB);
            });
            const composed = left(parserA, parserB);
            assertParser(composed);
            const res = composed.run(initState);
            expect(Result.equal(res, Result.csuc(errB, "nyan", stateB))).to.be.true;
        }
        // esuc, cerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });
            const parserB = new Parser(state => {
                expect(state).to.equal(stateA);
                return Result.cerr(errB);
            });
            const composed = left(parserA, parserB);
            assertParser(composed);
            const res = composed.run(initState);
            expect(Result.equal(res, Result.cerr(errB))).to.be.true;
        }
        // esuc, esuc
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });
            const parserB = new Parser(state => {
                expect(state).to.equal(stateA);
                return Result.esuc(errB, "cat", stateB);
            });
            const composed = left(parserA, parserB);
            assertParser(composed);
            const res = composed.run(initState);
            expect(Result.equal(res, Result.esuc(ParseError.merge(errA, errB), "nyan", stateB))).to.be.true;
        }
        // esuc, eerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });
            const parserB = new Parser(state => {
                expect(state).to.equal(stateA);
                return Result.eerr(errB);
            });
            const composed = left(parserA, parserB);
            assertParser(composed);
            const res = composed.run(initState);
            expect(Result.equal(res, Result.eerr(ParseError.merge(errA, errB)))).to.be.true;
        }
        // eerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(errA);
            });
            const parserB = new Parser(() => {
                throw new Error("unexpected call");
            });
            const composed = left(parserA, parserB);
            assertParser(composed);
            const res = composed.run(initState);
            expect(Result.equal(res, Result.eerr(errA))).to.be.true;
        }
    });
});

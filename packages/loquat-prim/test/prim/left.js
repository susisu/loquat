/*
 * loquat-prim test / prim.left()
 * copyright (c) 2016 Susisu
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
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        let stateA = new State(
            new Config({ tabWidth: 4 }),
            "restA",
            new SourcePos("foobar", 1, 2),
            "someA"
        );
        let errA = new ParseError(
            new SourcePos("foobar", 1, 2),
            [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
        );
        let stateB = new State(
            new Config({ tabWidth: 2 }),
            "restB",
            new SourcePos("foobar", 1, 2),
            "someB"
        );
        let errB = new ParseError(
            new SourcePos("foobar", 1, 2),
            [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
        );
        // csuc, csuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);
            });
            let parserB = new Parser(state => {
                expect(state).to.equal(stateA);
                return Result.csuc(errB, "cat", stateB);
            });
            let composed = left(parserA, parserB);
            assertParser(composed);
            let res = composed.run(initState);
            expect(Result.equal(res, Result.csuc(errB, "nyan", stateB))).to.be.true;
        }
        // csuc, cerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);

            });
            let parserB = new Parser(state => {
                expect(state).to.equal(stateA);
                return Result.cerr(errB);
            });
            let composed = left(parserA, parserB);
            assertParser(composed);
            let res = composed.run(initState);
            expect(Result.equal(res, Result.cerr(errB))).to.be.true;
        }
        // csuc, esuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);
            });
            let parserB = new Parser(state => {
                expect(state).to.equal(stateA);
                return Result.esuc(errB, "cat", stateB);
            });
            let composed = left(parserA, parserB);
            assertParser(composed);
            let res = composed.run(initState);
            expect(Result.equal(res, Result.csuc(ParseError.merge(errA, errB), "nyan", stateB))).to.be.true;
        }
        // csuc, eerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);
            });
            let parserB = new Parser(state => {
                expect(state).to.equal(stateA);
                return Result.eerr(errB);
            });
            let composed = left(parserA, parserB);
            assertParser(composed);
            let res = composed.run(initState);
            expect(Result.equal(res, Result.cerr(ParseError.merge(errA, errB)))).to.be.true;
        }
        // cerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(errA);
            });
            let parserB = new Parser(() => {
                throw new Error("unexpected call");
            });
            let composed = left(parserA, parserB);
            assertParser(composed);
            let res = composed.run(initState);
            expect(Result.equal(res, Result.cerr(errA))).to.be.true;
        }
        // esuc, csuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });
            let parserB = new Parser(state => {
                expect(state).to.equal(stateA);
                return Result.csuc(errB, "cat", stateB);
            });
            let composed = left(parserA, parserB);
            assertParser(composed);
            let res = composed.run(initState);
            expect(Result.equal(res, Result.csuc(errB, "nyan", stateB))).to.be.true;
        }
        // esuc, cerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });
            let parserB = new Parser(state => {
                expect(state).to.equal(stateA);
                return Result.cerr(errB);
            });
            let composed = left(parserA, parserB);
            assertParser(composed);
            let res = composed.run(initState);
            expect(Result.equal(res, Result.cerr(errB))).to.be.true;
        }
        // esuc, esuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });
            let parserB = new Parser(state => {
                expect(state).to.equal(stateA);
                return Result.esuc(errB, "cat", stateB);
            });
            let composed = left(parserA, parserB);
            assertParser(composed);
            let res = composed.run(initState);
            expect(Result.equal(res, Result.esuc(ParseError.merge(errA, errB), "nyan", stateB))).to.be.true;
        }
        // esuc, eerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });
            let parserB = new Parser(state => {
                expect(state).to.equal(stateA);
                return Result.eerr(errB);
            });
            let composed = left(parserA, parserB);
            assertParser(composed);
            let res = composed.run(initState);
            expect(Result.equal(res, Result.eerr(ParseError.merge(errA, errB)))).to.be.true;
        }
        // eerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(errA);
            });
            let parserB = new Parser(() => {
                throw new Error("unexpected call");
            });
            let composed = left(parserA, parserB);
            assertParser(composed);
            let res = composed.run(initState);
            expect(Result.equal(res, Result.eerr(errA))).to.be.true;
        }
    });
});

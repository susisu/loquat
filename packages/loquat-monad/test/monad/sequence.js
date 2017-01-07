/*
 * loquat-monad test / monad.sequence()
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

const sequence = _monad.sequence;

describe(".sequence(parsers)", () => {
    it("should return a parser that runs `parsers' sequentially", () => {
        const arrayEqual = (arrA, arrB) => arrA.length === arrB.length && arrA.every((elem, i) => elem === arrB[i]);

        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        // empty
        {
            const parser = sequence([]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(ParseError.unknown(initState.pos), [], initState),
                arrayEqual
            )).to.be.true;
        }
        // csuc, csuc
        {
            const stateA = new State(
                new Config({ tabWidth: 8 }),
                "restA",
                new SourcePos("foobar", 1, 2),
                "someA"
            );
            const errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);
            });

            const stateB = new State(
                new Config({ tabWidth: 8 }),
                "restB",
                new SourcePos("foobar", 1, 3),
                "someB"
            );
            const errB = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "cat", stateB);
            });

            const parser = sequence([parserA, parserB]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errB, ["nyan", "cat"], stateB),
                arrayEqual
            )).to.be.true;
        }
        // csuc, cerr
        {
            const stateA = new State(
                new Config({ tabWidth: 8 }),
                "restA",
                new SourcePos("foobar", 1, 2),
                "someA"
            );
            const errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);
            });

            const errB = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.cerr(errB);
            });

            const parser = sequence([parserA, parserB]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errB),
                arrayEqual
            )).to.be.true;
        }
        // csuc, esuc
        {
            const stateA = new State(
                new Config({ tabWidth: 8 }),
                "restA",
                new SourcePos("foobar", 1, 2),
                "someA"
            );
            const errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);
            });

            const stateB = new State(
                new Config({ tabWidth: 8 }),
                "restB",
                new SourcePos("foobar", 1, 3),
                "someB"
            );
            const errB = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "cat", stateB);
            });

            const parser = sequence([parserA, parserB]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(errA, errB), ["nyan", "cat"], stateB),
                arrayEqual
            )).to.be.true;
        }
        // csuc, eerr
        {
            const stateA = new State(
                new Config({ tabWidth: 8 }),
                "restA",
                new SourcePos("foobar", 1, 2),
                "someA"
            );
            const errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);
            });

            const errB = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.eerr(errB);
            });

            const parser = sequence([parserA, parserB]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errA, errB)),
                arrayEqual
            )).to.be.true;
        }
        // cerr, *
        {
            const errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(errA);
            });

            const parserB = new Parser(() => { throw new Error("unexpected call"); });

            const parser = sequence([parserA, parserB]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errA),
                arrayEqual
            )).to.be.true;
        }
        // esuc, csuc
        {
            const stateA = new State(
                new Config({ tabWidth: 8 }),
                "restA",
                new SourcePos("foobar", 1, 2),
                "someA"
            );
            const errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });

            const stateB = new State(
                new Config({ tabWidth: 8 }),
                "restB",
                new SourcePos("foobar", 1, 3),
                "someB"
            );
            const errB = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "cat", stateB);
            });

            const parser = sequence([parserA, parserB]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errB, ["nyan", "cat"], stateB),
                arrayEqual
            )).to.be.true;
        }
        // esuc, cerr
        {
            const stateA = new State(
                new Config({ tabWidth: 8 }),
                "restA",
                new SourcePos("foobar", 1, 2),
                "someA"
            );
            const errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });

            const errB = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.cerr(errB);
            });

            const parser = sequence([parserA, parserB]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errB),
                arrayEqual
            )).to.be.true;
        }
        // esuc, esuc
        {
            const stateA = new State(
                new Config({ tabWidth: 8 }),
                "restA",
                new SourcePos("foobar", 1, 2),
                "someA"
            );
            const errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });

            const stateB = new State(
                new Config({ tabWidth: 8 }),
                "restB",
                new SourcePos("foobar", 1, 3),
                "someB"
            );
            const errB = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "cat", stateB);
            });

            const parser = sequence([parserA, parserB]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(ParseError.merge(errA, errB), ["nyan", "cat"], stateB),
                arrayEqual
            )).to.be.true;
        }
        // esuc, eerr
        {
            const stateA = new State(
                new Config({ tabWidth: 8 }),
                "restA",
                new SourcePos("foobar", 1, 2),
                "someA"
            );
            const errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });

            const errB = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.eerr(errB);
            });

            const parser = sequence([parserA, parserB]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(ParseError.merge(errA, errB)),
                arrayEqual
            )).to.be.true;
        }
        // eerr, *
        {
            const errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(errA);
            });

            const parserB = new Parser(() => { throw new Error("unexpected call"); });

            const parser = sequence([parserA, parserB]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(errA),
                arrayEqual
            )).to.be.true;
        }
    });
});

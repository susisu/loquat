/*
 * loquat-monad test / monad.sequence_()
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

const sequence_ = _monad.sequence_;

describe(".sequence_(parsers)", () => {
    it("should return a parser that runs `parsers' sequentially and discards result values", () => {
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        // empty
        {
            let parser = sequence_([]);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(ParseError.unknown(initState.pos), undefined, initState)
            )).to.be.true;
        }
        // csuc, csuc
        {
            let stateA = new State(
                new Config({ tabWidth: 8 }),
                "restA",
                new SourcePos("foobar", 1, 2),
                "someA"
            );
            let errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);
            });

            let stateB = new State(
                new Config({ tabWidth: 8 }),
                "restB",
                new SourcePos("foobar", 1, 3),
                "someB"
            );
            let errB = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "cat", stateB);
            });

            let parser = sequence_([parserA, parserB]);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errB, undefined, stateB)
            )).to.be.true;
        }
        // csuc, cerr
        {
            let stateA = new State(
                new Config({ tabWidth: 8 }),
                "restA",
                new SourcePos("foobar", 1, 2),
                "someA"
            );
            let errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);
            });

            let errB = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.cerr(errB);
            });

            let parser = sequence_([parserA, parserB]);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errB)
            )).to.be.true;
        }
        // csuc, esuc
        {
            let stateA = new State(
                new Config({ tabWidth: 8 }),
                "restA",
                new SourcePos("foobar", 1, 2),
                "someA"
            );
            let errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);
            });

            let stateB = new State(
                new Config({ tabWidth: 8 }),
                "restB",
                new SourcePos("foobar", 1, 3),
                "someB"
            );
            let errB = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "cat", stateB);
            });

            let parser = sequence_([parserA, parserB]);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(errA, errB), undefined, stateB)
            )).to.be.true;
        }
        // csuc, eerr
        {
            let stateA = new State(
                new Config({ tabWidth: 8 }),
                "restA",
                new SourcePos("foobar", 1, 2),
                "someA"
            );
            let errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);
            });

            let errB = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.eerr(errB);
            });

            let parser = sequence_([parserA, parserB]);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errA, errB))
            )).to.be.true;
        }
        // cerr, *
        {
            let errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(errA);
            });

            let parserB = new Parser(() => { throw new Error("unexpected call"); });

            let parser = sequence_([parserA, parserB]);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errA)
            )).to.be.true;
        }
        // esuc, csuc
        {
            let stateA = new State(
                new Config({ tabWidth: 8 }),
                "restA",
                new SourcePos("foobar", 1, 2),
                "someA"
            );
            let errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });

            let stateB = new State(
                new Config({ tabWidth: 8 }),
                "restB",
                new SourcePos("foobar", 1, 3),
                "someB"
            );
            let errB = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "cat", stateB);
            });

            let parser = sequence_([parserA, parserB]);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errB, undefined, stateB)
            )).to.be.true;
        }
        // esuc, cerr
        {
            let stateA = new State(
                new Config({ tabWidth: 8 }),
                "restA",
                new SourcePos("foobar", 1, 2),
                "someA"
            );
            let errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });

            let errB = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.cerr(errB);
            });

            let parser = sequence_([parserA, parserB]);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errB)
            )).to.be.true;
        }
        // esuc, esuc
        {
            let stateA = new State(
                new Config({ tabWidth: 8 }),
                "restA",
                new SourcePos("foobar", 1, 2),
                "someA"
            );
            let errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });

            let stateB = new State(
                new Config({ tabWidth: 8 }),
                "restB",
                new SourcePos("foobar", 1, 3),
                "someB"
            );
            let errB = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "cat", stateB);
            });

            let parser = sequence_([parserA, parserB]);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(ParseError.merge(errA, errB), undefined, stateB)
            )).to.be.true;
        }
        // esuc, eerr
        {
            let stateA = new State(
                new Config({ tabWidth: 8 }),
                "restA",
                new SourcePos("foobar", 1, 2),
                "someA"
            );
            let errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });

            let errB = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.eerr(errB);
            });

            let parser = sequence_([parserA, parserB]);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(ParseError.merge(errA, errB))
            )).to.be.true;
        }
        // eerr, *
        {
            let errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(errA);
            });

            let parserB = new Parser(() => { throw new Error("unexpected call"); });

            let parser = sequence_([parserA, parserB]);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(errA)
            )).to.be.true;
        }
    });
});

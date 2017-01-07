/*
 * loquat-combinators test / combinators.choice()
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

const choice = _combinators.choice;

describe(".choice(parsers)", () => {
    it("should return a parser that empty-fails with unknown error if `parsers' is empty", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "ABC",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        const parser = choice([]);
        assertParser(parser);
        const res = parser.run(initState);
        expect(Result.equal(
            res,
            Result.eerr(ParseError.unknown(new SourcePos("foobar", 1, 1)))
        )).to.be.true;
    });

    it("should return a parser that attempts to parse by each parser in `parsers',"
        + " and return the result of the first one that succeeds", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        // csuc, *
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
                return Result.csuc(errA, "nyancat", stateA);
            });
            const parserB = new Parser(() => { throw new Error("unexpected call"); });
            const parser = choice([parserA, parserB]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errA, "nyancat", stateA)
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
            const parser = choice([parserA, parserB]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errA)
            )).to.be.true;
        }
        // esuc, *
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
                return Result.esuc(errA, "nyancat", stateA);
            });
            const parserB = new Parser(() => { throw new Error("unexpected call"); });
            const parser = choice([parserA, parserB]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(errA, "nyancat", stateA)
            )).to.be.true;
        }
        // eerr, csuc
        {
            const errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(errA);
            });
            const stateB = new State(
                new Config({ tabWidth: 8 }),
                "restB",
                new SourcePos("foobar", 1, 2),
                "someB"
            );
            const errB = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            const parserB = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errB, "nyancat", stateB);
            });
            const parser = choice([parserA, parserB]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errB, "nyancat", stateB)
            )).to.be.true;
        }
        // eerr, cerr
        {
            const errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(errA);
            });
            const errB = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            const parserB = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(errB);
            });
            const parser = choice([parserA, parserB]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errB)
            )).to.be.true;
        }
        // eerr, esuc
        {
            const errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(errA);
            });
            const stateB = new State(
                new Config({ tabWidth: 8 }),
                "restB",
                new SourcePos("foobar", 1, 2),
                "someB"
            );
            const errB = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            const parserB = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errB, "nyancat", stateB);
            });
            const parser = choice([parserA, parserB]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(ParseError.merge(errA, errB), "nyancat", stateB)
            )).to.be.true;
        }
        // eerr, eerr
        {
            const errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(errA);
            });
            const errB = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            const parserB = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(errB);
            });
            const parser = choice([parserA, parserB]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(ParseError.merge(errA, errB))
            )).to.be.true;
        }
    });
});

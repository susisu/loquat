/*
 * loquat-qo test / qo.qo()
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

const qo = _qo.qo;

describe(".qo(genFunc)", () => {
    it("should create a parser from generator that yields parsers", () => {
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        // empty
        {
            let parser = qo(function* () {});
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    ParseError.unknown(initState.pos.setColumn(1)),
                    undefined,
                    initState
                )
            )).to.be.true;
        }
        // just return
        {
            let parser = qo(function* () { return "nyancat"; });
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    ParseError.unknown(initState.pos.setColumn(1)),
                    "nyancat",
                    initState
                )
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
                expect(State.equal(state, initState));
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
                expect(State.equal(state, stateA));
                return Result.csuc(errB, "cat", stateB);
            });

            let parser = qo(function* () {
                let resA = yield parserA;
                expect(resA).to.equal("nyan");
                let resB = yield parserB;
                expect(resB).to.equal("cat");
                return "hello";
            });
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errB, "hello", stateB)
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
                expect(State.equal(state, initState));
                return Result.csuc(errA, "nyan", stateA);
            });

            let errB = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA));
                return Result.cerr(errB);
            });

            let parser = qo(function* () {
                let resA = yield parserA;
                expect(resA).to.equal("nyan");
                yield parserB;
                throw new Error("this should not be thrown");
            });
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
                expect(State.equal(state, initState));
                return Result.csuc(errA, "nyan", stateA);
            });

            let stateB = new State(
                new Config({ tabWidth: 8 }),
                "restB",
                new SourcePos("foobar", 1, 2),
                "someB"
            );
            let errB = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA));
                return Result.esuc(errB, "cat", stateB);
            });

            let parser = qo(function* () {
                let resA = yield parserA;
                expect(resA).to.equal("nyan");
                let resB = yield parserB;
                expect(resB).to.equal("cat");
                return "hello";
            });
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(errA, errB), "hello", stateB)
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
                expect(State.equal(state, initState));
                return Result.csuc(errA, "nyan", stateA);
            });

            let errB = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA));
                return Result.eerr(errB);
            });

            let parser = qo(function* () {
                let resA = yield parserA;
                expect(resA).to.equal("nyan");
                yield parserB;
                throw new Error("this should not be thrown");
            });
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
                expect(State.equal(state, initState));
                return Result.cerr(errA);
            });

            let parserB = new Parser(() => { throw new Error("unexpected call"); });

            let parser = qo(function* () {
                yield parserA;
                yield parserB;
            });
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
                new SourcePos("foobar", 1, 1),
                "someA"
            );
            let errA = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            let parserA = new Parser(state => {
                expect(State.equal(state, initState));
                return Result.esuc(errA, "nyan", stateA);
            });

            let stateB = new State(
                new Config({ tabWidth: 8 }),
                "restB",
                new SourcePos("foobar", 1, 2),
                "someB"
            );
            let errB = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA));
                return Result.csuc(errB, "cat", stateB);
            });

            let parser = qo(function* () {
                let resA = yield parserA;
                expect(resA).to.equal("nyan");
                let resB = yield parserB;
                expect(resB).to.equal("cat");
                return "hello";
            });
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errB, "hello", stateB)
            )).to.be.true;
        }
        // esuc, cerr
        {
            let stateA = new State(
                new Config({ tabWidth: 8 }),
                "restA",
                new SourcePos("foobar", 1, 1),
                "someA"
            );
            let errA = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            let parserA = new Parser(state => {
                expect(State.equal(state, initState));
                return Result.esuc(errA, "nyan", stateA);
            });

            let errB = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA));
                return Result.cerr(errB);
            });

            let parser = qo(function* () {
                let resA = yield parserA;
                expect(resA).to.equal("nyan");
                yield parserB;
                throw new Error("this should not be thrown");
            });
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
                new SourcePos("foobar", 1, 1),
                "someA"
            );
            let errA = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            let parserA = new Parser(state => {
                expect(State.equal(state, initState));
                return Result.esuc(errA, "nyan", stateA);
            });

            let stateB = new State(
                new Config({ tabWidth: 8 }),
                "restB",
                new SourcePos("foobar", 1, 1),
                "someB"
            );
            let errB = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA));
                return Result.esuc(errB, "cat", stateB);
            });

            let parser = qo(function* () {
                let resA = yield parserA;
                expect(resA).to.equal("nyan");
                let resB = yield parserB;
                expect(resB).to.equal("cat");
                return "hello";
            });
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(ParseError.merge(errA, errB), "hello", stateB)
            )).to.be.true;
        }
        // esuc, eerr
        {
            let stateA = new State(
                new Config({ tabWidth: 8 }),
                "restA",
                new SourcePos("foobar", 1, 1),
                "someA"
            );
            let errA = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            let parserA = new Parser(state => {
                expect(State.equal(state, initState));
                return Result.esuc(errA, "nyan", stateA);
            });

            let errB = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA));
                return Result.eerr(errB);
            });

            let parser = qo(function* () {
                let resA = yield parserA;
                expect(resA).to.equal("nyan");
                yield parserB;
                throw new Error("this should not be thrown");
            });
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
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            let parserA = new Parser(state => {
                expect(State.equal(state, initState));
                return Result.eerr(errA);
            });

            let parserB = new Parser(() => { throw new Error("unexpected call"); });

            let parser = qo(function* () {
                yield parserA;
                yield parserB;
            });
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(errA)
            )).to.be.true;
        }
    });

    it("should run parser thrown by the generator, and always treat the result as failed", () => {
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        // csuc
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
                expect(State.equal(state, initState));
                return Result.csuc(errA, "nyan", stateA);
            });
            let parser = qo(function* () {
                throw parserA;
            });
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errA)
            )).to.be.true;
        }
        // cerr
        {
            let errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            let parserA = new Parser(state => {
                expect(State.equal(state, initState));
                return Result.cerr(errA);
            });
            let parser = qo(function* () {
                throw parserA;
            });
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errA)
            )).to.be.true;
        }
        // esuc
        {
            let stateA = new State(
                new Config({ tabWidth: 8 }),
                "restA",
                new SourcePos("foobar", 1, 1),
                "someA"
            );
            let errA = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            let parserA = new Parser(state => {
                expect(State.equal(state, initState));
                return Result.esuc(errA, "nyan", stateA);
            });
            let parser = qo(function* () {
                throw parserA;
            });
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(errA)
            )).to.be.true;
        }
        // eerr
        {
            let errA = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            let parserA = new Parser(state => {
                expect(State.equal(state, initState));
                return Result.eerr(errA);
            });
            let parser = qo(function* () {
                throw parserA;
            });
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(errA)
            )).to.be.true;
        }
    });

    it("should rethrow error thrown by the generator if it is not a parser", () => {
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        let parser = qo(function* () {
            throw new Error("test");
        });
        expect(() => { parser.run(initState); }).to.throw(Error, /test/);
    });
});

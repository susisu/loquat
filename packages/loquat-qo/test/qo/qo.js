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
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        // empty
        {
            const parser = qo(function* () {});
            assertParser(parser);
            const res = parser.run(initState);
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
            const parser = qo(function* () { return "nyancat"; });
            assertParser(parser);
            const res = parser.run(initState);
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
                expect(State.equal(state, initState));
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
                expect(State.equal(state, stateA));
                return Result.csuc(errB, "cat", stateB);
            });

            const parser = qo(function* () {
                const resA = yield parserA;
                expect(resA).to.equal("nyan");
                const resB = yield parserB;
                expect(resB).to.equal("cat");
                return "hello";
            });
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errB, "hello", stateB)
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
                expect(State.equal(state, initState));
                return Result.csuc(errA, "nyan", stateA);
            });

            const errB = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA));
                return Result.cerr(errB);
            });

            const parser = qo(function* () {
                const resA = yield parserA;
                expect(resA).to.equal("nyan");
                yield parserB;
                throw new Error("this should not be thrown");
            });
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errB)
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
                expect(State.equal(state, initState));
                return Result.csuc(errA, "nyan", stateA);
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
                expect(State.equal(state, stateA));
                return Result.esuc(errB, "cat", stateB);
            });

            const parser = qo(function* () {
                const resA = yield parserA;
                expect(resA).to.equal("nyan");
                const resB = yield parserB;
                expect(resB).to.equal("cat");
                return "hello";
            });
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(errA, errB), "hello", stateB)
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
                expect(State.equal(state, initState));
                return Result.csuc(errA, "nyan", stateA);
            });

            const errB = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA));
                return Result.eerr(errB);
            });

            const parser = qo(function* () {
                const resA = yield parserA;
                expect(resA).to.equal("nyan");
                yield parserB;
                throw new Error("this should not be thrown");
            });
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errA, errB))
            )).to.be.true;
        }
        // cerr, *
        {
            const errA = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            const parserA = new Parser(state => {
                expect(State.equal(state, initState));
                return Result.cerr(errA);
            });

            const parserB = new Parser(() => { throw new Error("unexpected call"); });

            const parser = qo(function* () {
                yield parserA;
                yield parserB;
            });
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errA)
            )).to.be.true;
        }
        // esuc, csuc
        {
            const stateA = new State(
                new Config({ tabWidth: 8 }),
                "restA",
                new SourcePos("foobar", 1, 1),
                "someA"
            );
            const errA = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            const parserA = new Parser(state => {
                expect(State.equal(state, initState));
                return Result.esuc(errA, "nyan", stateA);
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
                expect(State.equal(state, stateA));
                return Result.csuc(errB, "cat", stateB);
            });

            const parser = qo(function* () {
                const resA = yield parserA;
                expect(resA).to.equal("nyan");
                const resB = yield parserB;
                expect(resB).to.equal("cat");
                return "hello";
            });
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errB, "hello", stateB)
            )).to.be.true;
        }
        // esuc, cerr
        {
            const stateA = new State(
                new Config({ tabWidth: 8 }),
                "restA",
                new SourcePos("foobar", 1, 1),
                "someA"
            );
            const errA = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            const parserA = new Parser(state => {
                expect(State.equal(state, initState));
                return Result.esuc(errA, "nyan", stateA);
            });

            const errB = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA));
                return Result.cerr(errB);
            });

            const parser = qo(function* () {
                const resA = yield parserA;
                expect(resA).to.equal("nyan");
                yield parserB;
                throw new Error("this should not be thrown");
            });
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errB)
            )).to.be.true;
        }
        // esuc, esuc
        {
            const stateA = new State(
                new Config({ tabWidth: 8 }),
                "restA",
                new SourcePos("foobar", 1, 1),
                "someA"
            );
            const errA = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            const parserA = new Parser(state => {
                expect(State.equal(state, initState));
                return Result.esuc(errA, "nyan", stateA);
            });

            const stateB = new State(
                new Config({ tabWidth: 8 }),
                "restB",
                new SourcePos("foobar", 1, 1),
                "someB"
            );
            const errB = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA));
                return Result.esuc(errB, "cat", stateB);
            });

            const parser = qo(function* () {
                const resA = yield parserA;
                expect(resA).to.equal("nyan");
                const resB = yield parserB;
                expect(resB).to.equal("cat");
                return "hello";
            });
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(ParseError.merge(errA, errB), "hello", stateB)
            )).to.be.true;
        }
        // esuc, eerr
        {
            const stateA = new State(
                new Config({ tabWidth: 8 }),
                "restA",
                new SourcePos("foobar", 1, 1),
                "someA"
            );
            const errA = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            const parserA = new Parser(state => {
                expect(State.equal(state, initState));
                return Result.esuc(errA, "nyan", stateA);
            });

            const errB = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA));
                return Result.eerr(errB);
            });

            const parser = qo(function* () {
                const resA = yield parserA;
                expect(resA).to.equal("nyan");
                yield parserB;
                throw new Error("this should not be thrown");
            });
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(ParseError.merge(errA, errB))
            )).to.be.true;
        }
        // eerr, *
        {
            const errA = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
            );
            const parserA = new Parser(state => {
                expect(State.equal(state, initState));
                return Result.eerr(errA);
            });

            const parserB = new Parser(() => { throw new Error("unexpected call"); });

            const parser = qo(function* () {
                yield parserA;
                yield parserB;
            });
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(errA)
            )).to.be.true;
        }
    });

    it("should run parser thrown by the generator, and always treat the result as failed", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        // csuc
        {
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
                    expect(State.equal(state, initState));
                    return Result.csuc(errA, "nyan", stateA);
                });
                const parser = qo(function* () {
                    throw parserA;
                });
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.cerr(errA)
                )).to.be.true;
            }
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
                    expect(State.equal(state, initState));
                    return Result.csuc(errA, "nyan", stateA);
                });
                const dummy = new Parser(state =>
                    Result.esuc(ParseError.unknown(state.pos), undefined, state)
                );
                const parser = qo(function* () {
                    yield dummy;
                    throw parserA;
                });
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.cerr(errA)
                )).to.be.true;
            }
        }
        // cerr
        {
            {
                const errA = new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                );
                const parserA = new Parser(state => {
                    expect(State.equal(state, initState));
                    return Result.cerr(errA);
                });
                const parser = qo(function* () {
                    throw parserA;
                });
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.cerr(errA)
                )).to.be.true;
            }
            {
                const errA = new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                );
                const parserA = new Parser(state => {
                    expect(State.equal(state, initState));
                    return Result.cerr(errA);
                });
                const dummy = new Parser(state =>
                    Result.esuc(ParseError.unknown(state.pos), undefined, state)
                );
                const parser = qo(function* () {
                    yield dummy;
                    throw parserA;
                });
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.cerr(errA)
                )).to.be.true;
            }
        }
        // esuc
        {
            {
                const stateA = new State(
                    new Config({ tabWidth: 8 }),
                    "restA",
                    new SourcePos("foobar", 1, 1),
                    "someA"
                );
                const errA = new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                );
                const parserA = new Parser(state => {
                    expect(State.equal(state, initState));
                    return Result.esuc(errA, "nyan", stateA);
                });
                const parser = qo(function* () {
                    throw parserA;
                });
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.eerr(errA)
                )).to.be.true;
            }
            {
                const stateA = new State(
                    new Config({ tabWidth: 8 }),
                    "restA",
                    new SourcePos("foobar", 1, 1),
                    "someA"
                );
                const errA = new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                );
                const parserA = new Parser(state => {
                    expect(State.equal(state, initState));
                    return Result.esuc(errA, "nyan", stateA);
                });
                const dummy = new Parser(state =>
                    Result.esuc(ParseError.unknown(state.pos), undefined, state)
                );
                const parser = qo(function* () {
                    yield dummy;
                    throw parserA;
                });
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.eerr(errA)
                )).to.be.true;
            }
        }
        // eerr
        {
            {
                const errA = new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                );
                const parserA = new Parser(state => {
                    expect(State.equal(state, initState));
                    return Result.eerr(errA);
                });
                const parser = qo(function* () {
                    throw parserA;
                });
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.eerr(errA)
                )).to.be.true;
            }
            {
                const errA = new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                );
                const parserA = new Parser(state => {
                    expect(State.equal(state, initState));
                    return Result.eerr(errA);
                });
                const dummy = new Parser(state =>
                    Result.esuc(ParseError.unknown(state.pos), undefined, state)
                );
                const parser = qo(function* () {
                    yield dummy;
                    throw parserA;
                });
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.eerr(errA)
                )).to.be.true;
            }
        }
    });

    it("should rethrow error thrown by the generator if it is not a parser", () => {
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "input",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = qo(function* () {
                throw new Error("test");
            });
            expect(() => { parser.run(initState); }).to.throw(Error, /test/);
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "input",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const dummy = new Parser(state =>
                Result.esuc(ParseError.unknown(state.pos), undefined, state)
            );
            const parser = qo(function* () {
                yield dummy;
                throw new Error("test");
            });
            expect(() => { parser.run(initState); }).to.throw(Error, /test/);
        }
    });
});

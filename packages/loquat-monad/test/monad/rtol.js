/*
 * loquat-monad test / monad.rtol()
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

const rtol = _monad.rtol;

describe(".rtol(funA, funcB)", () => {
    it("should return composed function (like a pipe from right to left) of `funcA' and `funcB'", () => {
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
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
            let funcA = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.csuc(errA, "cat", stateA);
                });
            };

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
            let funcB = val => {
                expect(val).to.equal("cat");
                return new Parser(state => {
                    expect(State.equal(state, stateA)).to.be.true;
                    return Result.csuc(errB, "NYANCAT", stateB);
                });
            };

            let func = rtol(funcB, funcA);
            expect(func).to.be.a("function");
            let parser = func("nyan");
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errB, "NYANCAT", stateB)
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
            let funcA = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.csuc(errA, "cat", stateA);
                });
            };

            let errB = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            let funcB = val => {
                expect(val).to.equal("cat");
                return new Parser(state => {
                    expect(State.equal(state, stateA)).to.be.true;
                    return Result.cerr(errB);
                });
            };

            let func = rtol(funcB, funcA);
            expect(func).to.be.a("function");
            let parser = func("nyan");
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
            let funcA = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.csuc(errA, "cat", stateA);
                });
            };

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
            let funcB = val => {
                expect(val).to.equal("cat");
                return new Parser(state => {
                    expect(State.equal(state, stateA)).to.be.true;
                    return Result.esuc(errB, "NYANCAT", stateB);
                });
            };

            let func = rtol(funcB, funcA);
            expect(func).to.be.a("function");
            let parser = func("nyan");
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(errA, errB), "NYANCAT", stateB)
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
            let funcA = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.csuc(errA, "cat", stateA);
                });
            };

            let errB = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            let funcB = val => {
                expect(val).to.equal("cat");
                return new Parser(state => {
                    expect(State.equal(state, stateA)).to.be.true;
                    return Result.eerr(errB);
                });
            };

            let func = rtol(funcB, funcA);
            expect(func).to.be.a("function");
            let parser = func("nyan");
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
            let funcA = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.cerr(errA);
                });
            };

            let funcB = () => { throw new Error("unexpected call"); };

            let func = rtol(funcB, funcA);
            expect(func).to.be.a("function");
            let parser = func("nyan");
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
            let funcA = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.esuc(errA, "cat", stateA);
                });
            };

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
            let funcB = val => {
                expect(val).to.equal("cat");
                return new Parser(state => {
                    expect(State.equal(state, stateA)).to.be.true;
                    return Result.csuc(errB, "NYANCAT", stateB);
                });
            };

            let func = rtol(funcB, funcA);
            expect(func).to.be.a("function");
            let parser = func("nyan");
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errB, "NYANCAT", stateB)
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
            let funcA = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.esuc(errA, "cat", stateA);
                });
            };

            let errB = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            let funcB = val => {
                expect(val).to.equal("cat");
                return new Parser(state => {
                    expect(State.equal(state, stateA)).to.be.true;
                    return Result.cerr(errB);
                });
            };

            let func = rtol(funcB, funcA);
            expect(func).to.be.a("function");
            let parser = func("nyan");
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
            let funcA = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.esuc(errA, "cat", stateA);
                });
            };

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
            let funcB = val => {
                expect(val).to.equal("cat");
                return new Parser(state => {
                    expect(State.equal(state, stateA)).to.be.true;
                    return Result.esuc(errB, "NYANCAT", stateB);
                });
            };

            let func = rtol(funcB, funcA);
            expect(func).to.be.a("function");
            let parser = func("nyan");
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(ParseError.merge(errA, errB), "NYANCAT", stateB)
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
            let funcA = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.esuc(errA, "cat", stateA);
                });
            };

            let errB = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
            );
            let funcB = val => {
                expect(val).to.equal("cat");
                return new Parser(state => {
                    expect(State.equal(state, stateA)).to.be.true;
                    return Result.eerr(errB);
                });
            };

            let func = rtol(funcB, funcA);
            expect(func).to.be.a("function");
            let parser = func("nyan");
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
            let funcA = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.eerr(errA);
                });
            };

            let funcB = () => { throw new Error("unexpected call"); };

            let func = rtol(funcB, funcA);
            expect(func).to.be.a("function");
            let parser = func("nyan");
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(errA)
            )).to.be.true;
        }
    });
});

/*
 * loquat-monad test / monad.liftM5()
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

const liftM5 = _monad.liftM5;

describe(".liftM5(func)", () => {
    it("should lift a function `func' to a function from five parsers to a parser", () => {
        let func = (a, b, c, d, e) =>
            a.toUpperCase() + b.toLowerCase() + c.toUpperCase() + d.toLowerCase() + e.toUpperCase();
        let liftedFunc = liftM5(func);
        expect(liftedFunc).is.a("function");

        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        let stateA = new State(
            new Config({ tabWidth: 4 }),
            "restA",
            new SourcePos("foobar", 1, 1),
            "someA"
        );
        let errA = new ParseError(
            new SourcePos("foobar", 1, 1),
            [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
        );
        let stateB = new State(
            new Config({ tabWidth: 4 }),
            "restB",
            new SourcePos("foobar", 1, 1),
            "someB"
        );
        let errB = new ParseError(
            new SourcePos("foobar", 1, 1),
            [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
        );
        let stateC = new State(
            new Config({ tabWidth: 4 }),
            "restC",
            new SourcePos("foobar", 1, 1),
            "someC"
        );
        let errC = new ParseError(
            new SourcePos("foobar", 1, 1),
            [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
        );
        let stateD = new State(
            new Config({ tabWidth: 4 }),
            "restD",
            new SourcePos("foobar", 1, 1),
            "someD"
        );
        let errD = new ParseError(
            new SourcePos("foobar", 1, 1),
            [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
        );
        let stateE = new State(
            new Config({ tabWidth: 4 }),
            "restE",
            new SourcePos("foobar", 1, 1),
            "someE"
        );
        let errE = new ParseError(
            new SourcePos("foobar", 1, 1),
            [new ErrorMessage(ErrorMessageType.MESSAGE, "testE")]
        );
        // csuc, csuc, csuc, csuc, csuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.csuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errE, "AbCdE", stateE)
            )).to.be.true;
        }
        // csuc, csuc, csuc, csuc, cerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.cerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errE)
            )).to.be.true;
        }
        // csuc, csuc, csuc, csuc, esuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.esuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(errD, errE), "AbCdE", stateE)
            )).to.be.true;
        }
        // csuc, csuc, csuc, csuc, eerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.eerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errD, errE))
            )).to.be.true;
        }
        // csuc, csuc, csuc, cerr, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.cerr(errD);
            });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errD)
            )).to.be.true;
        }
        // csuc, csuc, csuc, esuc, csuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.csuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errE, "AbCdE", stateE)
            )).to.be.true;
        }
        // csuc, csuc, csuc, esuc, cerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.cerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errE)
            )).to.be.true;
        }
        // csuc, csuc, csuc, esuc, esuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.esuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(ParseError.merge(errC, errD), errE), "AbCdE", stateE)
            )).to.be.true;
        }
        // csuc, csuc, csuc, esuc, eerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.eerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(ParseError.merge(errC, errD), errE))
            )).to.be.true;
        }
        // csuc, csuc, csuc, eerr, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.eerr(errD);
            });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errC, errD))
            )).to.be.true;
        }
        // csuc, csuc, cerr, *, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.cerr(errC);
            });
            let parserD = new Parser(() => { throw new Error("unexpected call"); });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errC)
            )).to.be.true;
        }
        // csuc, csuc, esuc, csuc, csuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.csuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errE, "AbCdE", stateE)
            )).to.be.true;
        }
        // csuc, csuc, esuc, csuc, cerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.cerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errE)
            )).to.be.true;
        }
        // csuc, csuc, esuc, csuc, esuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.esuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(errD, errE), "AbCdE", stateE)
            )).to.be.true;
        }
        // csuc, csuc, esuc, csuc, eerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.eerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errD, errE))
            )).to.be.true;
        }
        // csuc, csuc, esuc, cerr, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.cerr(errD);
            });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errD)
            )).to.be.true;
        }
        // csuc, csuc, esuc, esuc, csuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.csuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errE, "AbCdE", stateE)
            )).to.be.true;
        }
        // csuc, csuc, esuc, esuc, cerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.cerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errE)
            )).to.be.true;
        }
        // csuc, csuc, esuc, esuc, esuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.esuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.merge(ParseError.merge(ParseError.merge(errB, errC), errD), errE),
                    "AbCdE",
                    stateE
                )
            )).to.be.true;
        }
        // csuc, csuc, esuc, esuc, eerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.eerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(ParseError.merge(ParseError.merge(errB, errC), errD), errE))
            )).to.be.true;
        }
        // csuc, csuc, esuc, eerr, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.eerr(errD);
            });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(ParseError.merge(errB, errC), errD))
            )).to.be.true;
        }
        // csuc, csuc, eerr, *, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.eerr(errC);
            });
            let parserD = new Parser(() => { throw new Error("unexpected call"); });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errB, errC))
            )).to.be.true;
        }
        // csuc, cerr, *, *, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.cerr(errB);
            });
            let parserC = new Parser(() => { throw new Error("unexpected call"); });
            let parserD = new Parser(() => { throw new Error("unexpected call"); });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errB)
            )).to.be.true;
        }
        // csuc, esuc, csuc, csuc, csuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.csuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errE, "AbCdE", stateE)
            )).to.be.true;
        }
        // csuc, esuc, csuc, csuc, cerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.cerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errE)
            )).to.be.true;
        }
        // csuc, esuc, csuc, csuc, esuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.esuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(errD, errE), "AbCdE", stateE)
            )).to.be.true;
        }
        // csuc, esuc, csuc, csuc, eerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.eerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errD, errE))
            )).to.be.true;
        }
        // csuc, esuc, csuc, cerr, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.cerr(errD);
            });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errD)
            )).to.be.true;
        }
        // csuc, esuc, csuc, esuc, csuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.csuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errE, "AbCdE", stateE)
            )).to.be.true;
        }
        // csuc, esuc, csuc, esuc, cerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.cerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errE)
            )).to.be.true;
        }
        // csuc, esuc, csuc, esuc, esuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.esuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(ParseError.merge(errC, errD), errE), "AbCdE", stateE)
            )).to.be.true;
        }
        // csuc, esuc, csuc, esuc, eerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.eerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(ParseError.merge(errC, errD), errE))
            )).to.be.true;
        }
        // csuc, esuc, csuc, eerr, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.eerr(errD);
            });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errC, errD))
            )).to.be.true;
        }
        // csuc, esuc, cerr, *, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.cerr(errC);
            });
            let parserD = new Parser(() => { throw new Error("unexpected call"); });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errC)
            )).to.be.true;
        }
        // csuc, esuc, esuc, csuc, csuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.csuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errE, "AbCdE", stateE)
            )).to.be.true;
        }
        // csuc, esuc, esuc, csuc, cerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.cerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errE)
            )).to.be.true;
        }
        // csuc, esuc, esuc, csuc, esuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.esuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(errD, errE), "AbCdE", stateE)
            )).to.be.true;
        }
        // csuc, esuc, esuc, csuc, eerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.eerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errD, errE))
            )).to.be.true;
        }
        // csuc, esuc, esuc, cerr, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.cerr(errD);
            });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errD)
            )).to.be.true;
        }
        // csuc, esuc, esuc, esuc, csuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.csuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errE, "AbCdE", stateE)
            )).to.be.true;
        }
        // csuc, esuc, esuc, esuc, cerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.cerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errE)
            )).to.be.true;
        }
        // csuc, esuc, esuc, esuc, esuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.esuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.merge(
                        ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD),
                        errE
                    ),
                    "AbCdE",
                    stateE
                )
            )).to.be.true;
        }
        // csuc, esuc, esuc, esuc, eerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.eerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    ParseError.merge(
                        ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD),
                        errE
                    )
                )
            )).to.be.true;
        }
        // csuc, esuc, esuc, eerr, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.eerr(errD);
            });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD))
            )).to.be.true;
        }
        // csuc, esuc, eerr, *, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.eerr(errC);
            });
            let parserD = new Parser(() => { throw new Error("unexpected call"); });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(ParseError.merge(errA, errB), errC))
            )).to.be.true;
        }
        // csuc, eerr, *, *, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.eerr(errB);
            });
            let parserC = new Parser(() => { throw new Error("unexpected call"); });
            let parserD = new Parser(() => { throw new Error("unexpected call"); });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errA, errB))
            )).to.be.true;
        }
        // cerr, *, *, *, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(errA);
            });
            let parserB = new Parser(() => { throw new Error("unexpected call"); });
            let parserC = new Parser(() => { throw new Error("unexpected call"); });
            let parserD = new Parser(() => { throw new Error("unexpected call"); });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errA)
            )).to.be.true;
        }
        // esuc, csuc, csuc, csuc, csuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.csuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errE, "AbCdE", stateE)
            )).to.be.true;
        }
        // esuc, csuc, csuc, csuc, cerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.cerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errE)
            )).to.be.true;
        }
        // esuc, csuc, csuc, csuc, esuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.esuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(errD, errE), "AbCdE", stateE)
            )).to.be.true;
        }
        // esuc, csuc, csuc, csuc, eerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.eerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errD, errE))
            )).to.be.true;
        }
        // esuc, csuc, csuc, cerr, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.cerr(errD);
            });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errD)
            )).to.be.true;
        }
        // esuc, csuc, csuc, esuc, csuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.csuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errE, "AbCdE", stateE)
            )).to.be.true;
        }
        // esuc, csuc, csuc, esuc, cerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.cerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errE)
            )).to.be.true;
        }
        // esuc, csuc, csuc, esuc, esuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.esuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(ParseError.merge(errC, errD), errE), "AbCdE", stateE)
            )).to.be.true;
        }
        // esuc, csuc, csuc, esuc, eerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.eerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(ParseError.merge(errC, errD), errE))
            )).to.be.true;
        }
        // esuc, csuc, csuc, eerr, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.eerr(errD);
            });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errC, errD))
            )).to.be.true;
        }
        // esuc, csuc, cerr, *, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.cerr(errC);
            });
            let parserD = new Parser(() => { throw new Error("unexpected call"); });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errC)
            )).to.be.true;
        }
        // esuc, csuc, esuc, csuc, csuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.csuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errE, "AbCdE", stateE)
            )).to.be.true;
        }
        // esuc, csuc, esuc, csuc, cerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.cerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errE)
            )).to.be.true;
        }
        // esuc, csuc, esuc, csuc, esuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.esuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(errD, errE), "AbCdE", stateE)
            )).to.be.true;
        }
        // esuc, csuc, esuc, csuc, eerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.eerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errD, errE))
            )).to.be.true;
        }
        // esuc, csuc, esuc, cerr, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.cerr(errD);
            });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errD)
            )).to.be.true;
        }
        // esuc, csuc, esuc, esuc, csuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.csuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errE, "AbCdE", stateE)
            )).to.be.true;
        }
        // esuc, csuc, esuc, esuc, cerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.cerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errE)
            )).to.be.true;
        }
        // esuc, csuc, esuc, esuc, esuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.esuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.merge(ParseError.merge(ParseError.merge(errB, errC), errD), errE),
                    "AbCdE",
                    stateE
                )
            )).to.be.true;
        }
        // esuc, csuc, esuc, esuc, eerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.eerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(ParseError.merge(ParseError.merge(errB, errC), errD), errE))
            )).to.be.true;
        }
        // esuc, csuc, esuc, eerr, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.eerr(errD);
            });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(ParseError.merge(errB, errC), errD))
            )).to.be.true;
        }
        // esuc, csuc, eerr, *, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.eerr(errC);
            });
            let parserD = new Parser(() => { throw new Error("unexpected call"); });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errB, errC))
            )).to.be.true;
        }
        // esuc, cerr, *, *, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.cerr(errB);
            });
            let parserC = new Parser(() => { throw new Error("unexpected call"); });
            let parserD = new Parser(() => { throw new Error("unexpected call"); });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errB)
            )).to.be.true;
        }
        // esuc, esuc, csuc, csuc, csuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.csuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errE, "AbCdE", stateE)
            )).to.be.true;
        }
        // esuc, esuc, csuc, csuc, cerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.cerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errE)
            )).to.be.true;
        }
        // esuc, esuc, csuc, csuc, esuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.esuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(errD, errE), "AbCdE", stateE)
            )).to.be.true;
        }
        // esuc, esuc, csuc, csuc, eerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.eerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errD, errE))
            )).to.be.true;
        }
        // esuc, esuc, csuc, cerr, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.cerr(errD);
            });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errD)
            )).to.be.true;
        }
        // esuc, esuc, csuc, esuc, csuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.csuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errE, "AbCdE", stateE)
            )).to.be.true;
        }
        // esuc, esuc, csuc, esuc, cerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.cerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errE)
            )).to.be.true;
        }
        // esuc, esuc, csuc, esuc, esuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.esuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(ParseError.merge(errC, errD), errE), "AbCdE", stateE)
            )).to.be.true;
        }
        // esuc, esuc, csuc, esuc, eerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.eerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(ParseError.merge(errC, errD), errE))
            )).to.be.true;
        }
        // esuc, esuc, csuc, eerr, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.eerr(errD);
            });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errC, errD))
            )).to.be.true;
        }
        // esuc, esuc, cerr, *, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.cerr(errC);
            });
            let parserD = new Parser(() => { throw new Error("unexpected call"); });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errC)
            )).to.be.true;
        }
        // esuc, esuc, esuc, csuc, csuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.csuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errE, "AbCdE", stateE)
            )).to.be.true;
        }
        // esuc, esuc, esuc, csuc, cerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.cerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errE)
            )).to.be.true;
        }
        // esuc, esuc, esuc, csuc, esuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.esuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(errD, errE), "AbCdE", stateE)
            )).to.be.true;
        }
        // esuc, esuc, esuc, csuc, eerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.eerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errD, errE))
            )).to.be.true;
        }
        // esuc, esuc, esuc, cerr, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.cerr(errD);
            });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errD)
            )).to.be.true;
        }
        // esuc, esuc, esuc, esuc, csuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.csuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errE, "AbCdE", stateE)
            )).to.be.true;
        }
        // esuc, esuc, esuc, esuc, cerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.cerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errE)
            )).to.be.true;
        }
        // esuc, esuc, esuc, esuc, esuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.esuc(errE, "e", stateE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    ParseError.merge(
                        ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD),
                        errE
                    ),
                    "AbCdE",
                    stateE
                )
            )).to.be.true;
        }
        // esuc, esuc, esuc, esuc, eerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            let parserE = new Parser(state => {
                expect(State.equal(state, stateD)).to.be.true;
                return Result.eerr(errE);
            });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    ParseError.merge(
                        ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD),
                        errE
                    )
                )
            )).to.be.true;
        }
        // esuc, esuc, esuc, eerr, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            let parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.eerr(errD);
            });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD))
            )).to.be.true;
        }
        // esuc, esuc, eerr, *, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            let parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.eerr(errC);
            });
            let parserD = new Parser(() => { throw new Error("unexpected call"); });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(ParseError.merge(ParseError.merge(errA, errB), errC))
            )).to.be.true;
        }
        // esuc, eerr, *, *, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            let parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.eerr(errB);
            });
            let parserC = new Parser(() => { throw new Error("unexpected call"); });
            let parserD = new Parser(() => { throw new Error("unexpected call"); });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(ParseError.merge(errA, errB))
            )).to.be.true;
        }
        // eerr, *, *, *, *
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(errA);
            });
            let parserB = new Parser(() => { throw new Error("unexpected call"); });
            let parserC = new Parser(() => { throw new Error("unexpected call"); });
            let parserD = new Parser(() => { throw new Error("unexpected call"); });
            let parserE = new Parser(() => { throw new Error("unexpected call"); });
            let parser = liftedFunc(parserA, parserB, parserC, parserD, parserE);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(errA)
            )).to.be.true;
        }
    });
});

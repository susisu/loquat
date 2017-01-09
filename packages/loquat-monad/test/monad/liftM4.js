/*
 * loquat-monad test / monad.liftM4()
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

const liftM4 = _monad.liftM4;

describe(".liftM4(func)", () => {
    it("should lift a function `func' to a function from four parsers to a parser", () => {
        const func = (x, y, z, w) => x.toUpperCase() + y.toLowerCase() + z.toUpperCase() + w.toLowerCase();
        const liftedFunc = liftM4(func);
        expect(liftedFunc).is.a("function");

        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        const stateA = new State(
            new Config({ tabWidth: 4 }),
            "restA",
            new SourcePos("foobar", 1, 1),
            "someA"
        );
        const errA = new ParseError(
            new SourcePos("foobar", 1, 1),
            [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
        );
        const stateB = new State(
            new Config({ tabWidth: 4 }),
            "restB",
            new SourcePos("foobar", 1, 1),
            "someB"
        );
        const errB = new ParseError(
            new SourcePos("foobar", 1, 1),
            [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
        );
        const stateC = new State(
            new Config({ tabWidth: 4 }),
            "restC",
            new SourcePos("foobar", 1, 1),
            "someC"
        );
        const errC = new ParseError(
            new SourcePos("foobar", 1, 1),
            [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
        );
        const stateD = new State(
            new Config({ tabWidth: 4 }),
            "restD",
            new SourcePos("foobar", 1, 1),
            "someD"
        );
        const errD = new ParseError(
            new SourcePos("foobar", 1, 1),
            [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
        );
        // csuc, csuc, csuc, csuc
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errD, "AbCd", stateD)
            )).to.be.true;
        }
        // csuc, csuc, csuc, cerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.cerr(errD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errD)
            )).to.be.true;
        }
        // csuc, csuc, csuc, esuc
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(errC, errD), "AbCd", stateD)
            )).to.be.true;
        }
        // csuc, csuc, csuc, eerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.eerr(errD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errC, errD))
            )).to.be.true;
        }
        // csuc, csuc, cerr, *
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.cerr(errC);
            });
            const parserD = new Parser(() => { throw new Error("unexpected call"); });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errC)
            )).to.be.true;
        }
        // csuc, csuc, esuc, csuc
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errD, "AbCd", stateD)
            )).to.be.true;
        }
        // csuc, csuc, esuc, cerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.cerr(errD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errD)
            )).to.be.true;
        }
        // csuc, csuc, esuc, esuc
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(ParseError.merge(errB, errC), errD), "AbCd", stateD)
            )).to.be.true;
        }
        // csuc, csuc, esuc, eerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.eerr(errD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(ParseError.merge(errB, errC), errD))
            )).to.be.true;
        }
        // csuc, csuc, eerr, *
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.eerr(errC);
            });
            const parserD = new Parser(() => { throw new Error("unexpected call"); });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errB, errC))
            )).to.be.true;
        }
        // csuc, cerr, *, *
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.cerr(errB);
            });
            const parserC = new Parser(() => { throw new Error("unexpected call"); });
            const parserD = new Parser(() => { throw new Error("unexpected call"); });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errB)
            )).to.be.true;
        }
        // csuc, esuc, csuc, csuc
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errD, "AbCd", stateD)
            )).to.be.true;
        }
        // csuc, esuc, csuc, cerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.cerr(errD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errD)
            )).to.be.true;
        }
        // csuc, esuc, csuc, esuc
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(errC, errD), "AbCd", stateD)
            )).to.be.true;
        }
        // csuc, esuc, csuc, eerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.eerr(errD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errC, errD))
            )).to.be.true;
        }
        // csuc, esuc, cerr, *
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.cerr(errC);
            });
            const parserD = new Parser(() => { throw new Error("unexpected call"); });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errC)
            )).to.be.true;
        }
        // csuc, esuc, esuc, csuc
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errD, "AbCd", stateD)
            )).to.be.true;
        }
        // csuc, esuc, esuc, cerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.cerr(errD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errD)
            )).to.be.true;
        }
        // csuc, esuc, esuc, esuc
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD),
                    "AbCd",
                    stateD
                )
            )).to.be.true;
        }
        // csuc, esuc, esuc, eerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.eerr(errD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD))
            )).to.be.true;
        }
        // csuc, esuc, eerr, *
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.eerr(errC);
            });
            const parserD = new Parser(() => { throw new Error("unexpected call"); });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(ParseError.merge(errA, errB), errC))
            )).to.be.true;
        }
        // csuc, eerr, *, *
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.eerr(errB);
            });
            const parserC = new Parser(() => { throw new Error("unexpected call"); });
            const parserD = new Parser(() => { throw new Error("unexpected call"); });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errA, errB))
            )).to.be.true;
        }
        // cerr, *, *, *
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(errA);
            });
            const parserB = new Parser(() => { throw new Error("unexpected call"); });
            const parserC = new Parser(() => { throw new Error("unexpected call"); });
            const parserD = new Parser(() => { throw new Error("unexpected call"); });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errA)
            )).to.be.true;
        }
        // esuc, csuc, csuc, csuc
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errD, "AbCd", stateD)
            )).to.be.true;
        }
        // esuc, csuc, csuc, cerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.cerr(errD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errD)
            )).to.be.true;
        }
        // esuc, csuc, csuc, esuc
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(errC, errD), "AbCd", stateD)
            )).to.be.true;
        }
        // esuc, csuc, csuc, eerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.eerr(errD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errC, errD))
            )).to.be.true;
        }
        // esuc, csuc, cerr, *
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.cerr(errC);
            });
            const parserD = new Parser(() => { throw new Error("unexpected call"); });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errC)
            )).to.be.true;
        }
        // esuc, csuc, esuc, csuc
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errD, "AbCd", stateD)
            )).to.be.true;
        }
        // esuc, csuc, esuc, cerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.cerr(errD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errD)
            )).to.be.true;
        }
        // esuc, csuc, esuc, esuc
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(ParseError.merge(errB, errC), errD), "AbCd", stateD)
            )).to.be.true;
        }
        // esuc, csuc, esuc, eerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.eerr(errD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(ParseError.merge(errB, errC), errD))
            )).to.be.true;
        }
        // esuc, csuc, eerr, *
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.csuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.eerr(errC);
            });
            const parserD = new Parser(() => { throw new Error("unexpected call"); });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errB, errC))
            )).to.be.true;
        }
        // esuc, cerr, *, *
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.cerr(errB);
            });
            const parserC = new Parser(() => { throw new Error("unexpected call"); });
            const parserD = new Parser(() => { throw new Error("unexpected call"); });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errB)
            )).to.be.true;
        }
        // esuc, esuc, csuc, csuc
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errD, "AbCd", stateD)
            )).to.be.true;
        }
        // esuc, esuc, csuc, cerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.cerr(errD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errD)
            )).to.be.true;
        }
        // esuc, esuc, csuc, esuc
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(errC, errD), "AbCd", stateD)
            )).to.be.true;
        }
        // esuc, esuc, csuc, eerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.csuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.eerr(errD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errC, errD))
            )).to.be.true;
        }
        // esuc, esuc, cerr, *
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.cerr(errC);
            });
            const parserD = new Parser(() => { throw new Error("unexpected call"); });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errC)
            )).to.be.true;
        }
        // esuc, esuc, esuc, csuc
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.csuc(errD, "D", stateD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errD, "AbCd", stateD)
            )).to.be.true;
        }
        // esuc, esuc, esuc, cerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.cerr(errD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errD)
            )).to.be.true;
        }
        // esuc, esuc, esuc, esuc
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.esuc(errD, "D", stateD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD),
                    "AbCd",
                    stateD
                )
            )).to.be.true;
        }
        // esuc, esuc, esuc, eerr
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.esuc(errC, "c", stateC);
            });
            const parserD = new Parser(state => {
                expect(State.equal(state, stateC)).to.be.true;
                return Result.eerr(errD);
            });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(ParseError.merge(ParseError.merge(ParseError.merge(errA, errB), errC), errD))
            )).to.be.true;
        }
        // esuc, esuc, eerr, *
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.esuc(errB, "B", stateB);
            });
            const parserC = new Parser(state => {
                expect(State.equal(state, stateB)).to.be.true;
                return Result.eerr(errC);
            });
            const parserD = new Parser(() => { throw new Error("unexpected call"); });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(ParseError.merge(ParseError.merge(errA, errB), errC))
            )).to.be.true;
        }
        // esuc, eerr, *, *
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "a", stateA);
            });
            const parserB = new Parser(state => {
                expect(State.equal(state, stateA)).to.be.true;
                return Result.eerr(errB);
            });
            const parserC = new Parser(() => { throw new Error("unexpected call"); });
            const parserD = new Parser(() => { throw new Error("unexpected call"); });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(ParseError.merge(errA, errB))
            )).to.be.true;
        }
        // eerr, *, *, *
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(errA);
            });
            const parserB = new Parser(() => { throw new Error("unexpected call"); });
            const parserC = new Parser(() => { throw new Error("unexpected call"); });
            const parserD = new Parser(() => { throw new Error("unexpected call"); });
            const parser = liftedFunc(parserA, parserB, parserC, parserD);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(errA)
            )).to.be.true;
        }
    });
});

/*
 * loquat-monad test / monad.liftM3()
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

const liftM3 = _monad.liftM3;

describe(".liftM3(func)", () => {
    it("should lift a function `func' to a function from three parsers to a parser", () => {
        const func = (x, y, z) => x.toUpperCase() + y.toLowerCase() + z.toUpperCase();
        const liftedFunc = liftM3(func);
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
        // csuc, csuc, csuc
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
            const parser = liftedFunc(parserA, parserB, parserC);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errC, "AbC", stateC)
            )).to.be.true;
        }
        // csuc, csuc, cerr
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
            const parser = liftedFunc(parserA, parserB, parserC);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errC)
            )).to.be.true;
        }
        // csuc, csuc, esuc
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
            const parser = liftedFunc(parserA, parserB, parserC);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(errB, errC), "AbC", stateC)
            )).to.be.true;
        }
        // csuc, csuc, eerr
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
            const parser = liftedFunc(parserA, parserB, parserC);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errB, errC))
            )).to.be.true;
        }
        // csuc, cerr, *
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
            const parser = liftedFunc(parserA, parserB, parserC);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errB)
            )).to.be.true;
        }
        // csuc, esuc, csuc
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
            const parser = liftedFunc(parserA, parserB, parserC);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errC, "AbC", stateC)
            )).to.be.true;
        }
        // csuc, esuc, cerr
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
            const parser = liftedFunc(parserA, parserB, parserC);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errC)
            )).to.be.true;
        }
        // csuc, esuc, esuc
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
            const parser = liftedFunc(parserA, parserB, parserC);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(ParseError.merge(errA, errB), errC), "AbC", stateC)
            )).to.be.true;
        }
        // csuc, esuc, eerr
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
            const parser = liftedFunc(parserA, parserB, parserC);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(ParseError.merge(errA, errB), errC))
            )).to.be.true;
        }
        // csuc, eerr, *
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
            const parser = liftedFunc(parserA, parserB, parserC);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errA, errB))
            )).to.be.true;
        }
        // cerr, *, *
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(errA);
            });
            const parserB = new Parser(() => { throw new Error("unexpected call"); });
            const parserC = new Parser(() => { throw new Error("unexpected call"); });
            const parser = liftedFunc(parserA, parserB, parserC);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errA)
            )).to.be.true;
        }
        // esuc, csuc, csuc
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
            const parser = liftedFunc(parserA, parserB, parserC);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errC, "AbC", stateC)
            )).to.be.true;
        }
        // esuc, csuc, cerr
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
            const parser = liftedFunc(parserA, parserB, parserC);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errC)
            )).to.be.true;
        }
        // esuc, csuc, esuc
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
            const parser = liftedFunc(parserA, parserB, parserC);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(errB, errC), "AbC", stateC)
            )).to.be.true;
        }
        // esuc, csuc, eerr
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
            const parser = liftedFunc(parserA, parserB, parserC);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errB, errC))
            )).to.be.true;
        }
        // esuc, cerr, *
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
            const parser = liftedFunc(parserA, parserB, parserC);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errB)
            )).to.be.true;
        }
        // esuc, esuc, csuc
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
            const parser = liftedFunc(parserA, parserB, parserC);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errC, "AbC", stateC)
            )).to.be.true;
        }
        // esuc, esuc, cerr
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
            const parser = liftedFunc(parserA, parserB, parserC);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errC)
            )).to.be.true;
        }
        // esuc, esuc, esuc
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
            const parser = liftedFunc(parserA, parserB, parserC);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(ParseError.merge(ParseError.merge(errA, errB), errC), "AbC", stateC)
            )).to.be.true;
        }
        // esuc, esuc, eerr
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
            const parser = liftedFunc(parserA, parserB, parserC);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(ParseError.merge(ParseError.merge(errA, errB), errC))
            )).to.be.true;
        }
        // esuc, eerr, *
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
            const parser = liftedFunc(parserA, parserB, parserC);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(ParseError.merge(errA, errB))
            )).to.be.true;
        }
        // eerr, *, *
        {
            const parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(errA);
            });
            const parserB = new Parser(() => { throw new Error("unexpected call"); });
            const parserC = new Parser(() => { throw new Error("unexpected call"); });
            const parser = liftedFunc(parserA, parserB, parserC);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(errA)
            )).to.be.true;
        }
    });
});

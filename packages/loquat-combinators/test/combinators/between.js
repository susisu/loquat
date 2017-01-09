/*
 * loquat-combinators test / combinators.between()
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

const between = _combinators.between;

describe(".between(open, close, parser)", () => {
    it("should return a parser that parses what `parser' accepts between `open' and `close'", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        // csuc, csuc, csuc
        {
            const stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 2),
                "someO"
            );
            const errO = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            const open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errO, "open", stateO);
            });

            const stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 3),
                "someP"
            );
            const errP = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            const p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.csuc(errP, "nyancat", stateP);
            });

            const stateC = new State(
                new Config({ tabWidth: 8 }),
                "restC",
                new SourcePos("foobar", 1, 4),
                "someC"
            );
            const errC = new ParseError(
                new SourcePos("foobar", 1, 4),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            const close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.csuc(errC, "close", stateC);
            });

            const parser = between(open, close, p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errC, "nyancat", stateC)
            )).to.be.true;
        }
        // csuc, csuc, cerr
        {
            const stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 2),
                "someO"
            );
            const errO = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            const open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errO, "open", stateO);
            });

            const stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 3),
                "someP"
            );
            const errP = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            const p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.csuc(errP, "nyancat", stateP);
            });

            const errC = new ParseError(
                new SourcePos("foobar", 1, 4),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            const close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.cerr(errC);
            });

            const parser = between(open, close, p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errC)
            )).to.be.true;
        }
        // csuc, csuc, esuc
        {
            const stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 2),
                "someO"
            );
            const errO = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            const open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errO, "open", stateO);
            });

            const stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 3),
                "someP"
            );
            const errP = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            const p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.csuc(errP, "nyancat", stateP);
            });

            const stateC = new State(
                new Config({ tabWidth: 8 }),
                "restC",
                new SourcePos("foobar", 1, 3),
                "someC"
            );
            const errC = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            const close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.esuc(errC, "close", stateC);
            });

            const parser = between(open, close, p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(errP, errC), "nyancat", stateC)
            )).to.be.true;
        }
        // csuc, csuc, eerr
        {
            const stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 2),
                "someO"
            );
            const errO = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            const open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errO, "open", stateO);
            });

            const stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 3),
                "someP"
            );
            const errP = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            const p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.csuc(errP, "nyancat", stateP);
            });

            const errC = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            const close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.eerr(errC);
            });

            const parser = between(open, close, p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errP, errC))
            )).to.be.true;
        }
        // csuc, cerr, *
        {
            const stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 2),
                "someO"
            );
            const errO = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            const open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errO, "open", stateO);
            });

            const errP = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            const p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.cerr(errP);
            });

            const close = new Parser(() => { throw new Error("unexpected call"); });

            const parser = between(open, close, p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errP)
            )).to.be.true;
        }
        // csuc, esuc, csuc
        {
            const stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 2),
                "someO"
            );
            const errO = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            const open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errO, "open", stateO);
            });

            const stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 2),
                "someP"
            );
            const errP = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            const p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.esuc(errP, "nyancat", stateP);
            });

            const stateC = new State(
                new Config({ tabWidth: 8 }),
                "restC",
                new SourcePos("foobar", 1, 3),
                "someC"
            );
            const errC = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            const close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.csuc(errC, "close", stateC);
            });

            const parser = between(open, close, p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errC, "nyancat", stateC)
            )).to.be.true;
        }
        // csuc, esuc, cerr
        {
            const stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 2),
                "someO"
            );
            const errO = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            const open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errO, "open", stateO);
            });

            const stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 2),
                "someP"
            );
            const errP = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            const p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.esuc(errP, "nyancat", stateP);
            });

            const errC = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            const close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.cerr(errC);
            });

            const parser = between(open, close, p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errC)
            )).to.be.true;
        }
        // csuc, esuc, esuc
        {
            const stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 2),
                "someO"
            );
            const errO = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            const open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errO, "open", stateO);
            });

            const stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 2),
                "someP"
            );
            const errP = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            const p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.esuc(errP, "nyancat", stateP);
            });

            const stateC = new State(
                new Config({ tabWidth: 8 }),
                "restC",
                new SourcePos("foobar", 1, 2),
                "someC"
            );
            const errC = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            const close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.esuc(errC, "close", stateC);
            });

            const parser = between(open, close, p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(ParseError.merge(errO, errP), errC), "nyancat", stateC)
            )).to.be.true;
        }
        // csuc, esuc, eerr
        {
            const stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 2),
                "someO"
            );
            const errO = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            const open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errO, "open", stateO);
            });

            const stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 2),
                "someP"
            );
            const errP = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            const p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.esuc(errP, "nyancat", stateP);
            });

            const errC = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            const close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.eerr(errC);
            });

            const parser = between(open, close, p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(ParseError.merge(errO, errP), errC))
            )).to.be.true;
        }
        // csuc, eerr, *
        {
            const stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 2),
                "someO"
            );
            const errO = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            const open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errO, "open", stateO);
            });

            const errP = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            const p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.eerr(errP);
            });

            const close = new Parser(() => { throw new Error("unexpected call"); });

            const parser = between(open, close, p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errO, errP))
            )).to.be.true;
        }
        // cerr, *, *
        {
            const errO = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            const open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(errO);
            });

            const p = new Parser(() => { throw new Error("unexpected call"); });

            const close = new Parser(() => { throw new Error("unexpected call"); });

            const parser = between(open, close, p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errO)
            )).to.be.true;
        }
        // esuc, csuc, csuc
        {
            const stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 1),
                "someO"
            );
            const errO = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            const open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errO, "open", stateO);
            });

            const stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 2),
                "someP"
            );
            const errP = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            const p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.csuc(errP, "nyancat", stateP);
            });

            const stateC = new State(
                new Config({ tabWidth: 8 }),
                "restC",
                new SourcePos("foobar", 1, 3),
                "someC"
            );
            const errC = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            const close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.csuc(errC, "close", stateC);
            });

            const parser = between(open, close, p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errC, "nyancat", stateC)
            )).to.be.true;
        }
        // esuc, csuc, cerr
        {
            const stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 1),
                "someO"
            );
            const errO = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            const open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errO, "open", stateO);
            });

            const stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 2),
                "someP"
            );
            const errP = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            const p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.csuc(errP, "nyancat", stateP);
            });

            const errC = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            const close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.cerr(errC);
            });

            const parser = between(open, close, p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errC)
            )).to.be.true;
        }
        // esuc, csuc, esuc
        {
            const stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 1),
                "someO"
            );
            const errO = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            const open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errO, "open", stateO);
            });

            const stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 2),
                "someP"
            );
            const errP = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            const p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.csuc(errP, "nyancat", stateP);
            });

            const stateC = new State(
                new Config({ tabWidth: 8 }),
                "restC",
                new SourcePos("foobar", 1, 2),
                "someC"
            );
            const errC = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            const close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.esuc(errC, "close", stateC);
            });

            const parser = between(open, close, p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(errP, errC), "nyancat", stateC)
            )).to.be.true;
        }
        // esuc, csuc, eerr
        {
            const stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 1),
                "someO"
            );
            const errO = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            const open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errO, "open", stateO);
            });

            const stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 2),
                "someP"
            );
            const errP = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            const p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.csuc(errP, "nyancat", stateP);
            });

            const errC = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            const close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.eerr(errC);
            });

            const parser = between(open, close, p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errP, errC))
            )).to.be.true;
        }
        // esuc, cerr, *
        {
            const stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 1),
                "someO"
            );
            const errO = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            const open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errO, "open", stateO);
            });

            const errP = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            const p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.cerr(errP);
            });

            const close = new Parser(() => { throw new Error("unexpected call"); });

            const parser = between(open, close, p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errP)
            )).to.be.true;
        }
        // esuc, esuc, csuc
        {
            const stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 1),
                "someO"
            );
            const errO = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            const open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errO, "open", stateO);
            });

            const stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 1),
                "someP"
            );
            const errP = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            const p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.esuc(errP, "nyancat", stateP);
            });

            const stateC = new State(
                new Config({ tabWidth: 8 }),
                "restC",
                new SourcePos("foobar", 1, 2),
                "someC"
            );
            const errC = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            const close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.csuc(errC, "close", stateC);
            });

            const parser = between(open, close, p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errC, "nyancat", stateC)
            )).to.be.true;
        }
        // esuc, esuc, cerr
        {
            const stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 1),
                "someO"
            );
            const errO = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            const open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errO, "open", stateO);
            });

            const stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 1),
                "someP"
            );
            const errP = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            const p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.esuc(errP, "nyancat", stateP);
            });

            const errC = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            const close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.cerr(errC);
            });

            const parser = between(open, close, p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errC)
            )).to.be.true;
        }
        // esuc, esuc, esuc
        {
            const stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 1),
                "someO"
            );
            const errO = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            const open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errO, "open", stateO);
            });

            const stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 1),
                "someP"
            );
            const errP = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            const p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.esuc(errP, "nyancat", stateP);
            });

            const stateC = new State(
                new Config({ tabWidth: 8 }),
                "restC",
                new SourcePos("foobar", 1, 1),
                "someC"
            );
            const errC = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            const close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.esuc(errC, "close", stateC);
            });

            const parser = between(open, close, p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(ParseError.merge(ParseError.merge(errO, errP), errC), "nyancat", stateC)
            )).to.be.true;
        }
        // esuc, esuc, eerr
        {
            const stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 1),
                "someO"
            );
            const errO = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            const open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errO, "open", stateO);
            });

            const stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 1),
                "someP"
            );
            const errP = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            const p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.esuc(errP, "nyancat", stateP);
            });

            const errC = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            const close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.eerr(errC);
            });

            const parser = between(open, close, p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(ParseError.merge(ParseError.merge(errO, errP), errC))
            )).to.be.true;
        }
        // esuc, eerr, *
        {
            const stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 1),
                "someO"
            );
            const errO = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            const open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errO, "open", stateO);
            });

            const errP = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            const p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.eerr(errP);
            });

            const close = new Parser(() => { throw new Error("unexpected call"); });

            const parser = between(open, close, p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(ParseError.merge(errO, errP))
            )).to.be.true;
        }
        // eerr, *, *
        {
            const errO = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            const open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(errO);
            });

            const p = new Parser(() => { throw new Error("unexpected call"); });

            const close = new Parser(() => { throw new Error("unexpected call"); });

            const parser = between(open, close, p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(errO)
            )).to.be.true;
        }
    });
});

/*
 * loquat-combinators test / combinators.between()
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

const between = _combinators.between;

describe(".between(open, close, parser)", () => {
    it("should return a parser that parses what `parser' accepts between `open' and `close'", () => {
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        // csuc, csuc, csuc
        {
            let stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 2),
                "someO"
            );
            let errO = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            let open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errO, "open", stateO);
            });

            let stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 3),
                "someP"
            );
            let errP = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            let p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.csuc(errP, "nyancat", stateP);
            });

            let stateC = new State(
                new Config({ tabWidth: 8 }),
                "restC",
                new SourcePos("foobar", 1, 4),
                "someC"
            );
            let errC = new ParseError(
                new SourcePos("foobar", 1, 4),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            let close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.csuc(errC, "close", stateC);
            });

            let parser = between(open, close, p);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errC, "nyancat", stateC)
            )).to.be.true;
        }
        // csuc, csuc, cerr
        {
            let stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 2),
                "someO"
            );
            let errO = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            let open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errO, "open", stateO);
            });

            let stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 3),
                "someP"
            );
            let errP = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            let p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.csuc(errP, "nyancat", stateP);
            });

            let errC = new ParseError(
                new SourcePos("foobar", 1, 4),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            let close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.cerr(errC);
            });

            let parser = between(open, close, p);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errC)
            )).to.be.true;
        }
        // csuc, csuc, esuc
        {
            let stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 2),
                "someO"
            );
            let errO = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            let open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errO, "open", stateO);
            });

            let stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 3),
                "someP"
            );
            let errP = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            let p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.csuc(errP, "nyancat", stateP);
            });

            let stateC = new State(
                new Config({ tabWidth: 8 }),
                "restC",
                new SourcePos("foobar", 1, 3),
                "someC"
            );
            let errC = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            let close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.esuc(errC, "close", stateC);
            });

            let parser = between(open, close, p);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(errP, errC), "nyancat", stateC)
            )).to.be.true;
        }
        // csuc, csuc, eerr
        {
            let stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 2),
                "someO"
            );
            let errO = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            let open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errO, "open", stateO);
            });

            let stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 3),
                "someP"
            );
            let errP = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            let p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.csuc(errP, "nyancat", stateP);
            });

            let errC = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            let close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.eerr(errC);
            });

            let parser = between(open, close, p);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errP, errC))
            )).to.be.true;
        }
        // csuc, cerr, *
        {
            let stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 2),
                "someO"
            );
            let errO = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            let open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errO, "open", stateO);
            });

            let errP = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            let p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.cerr(errP);
            });

            let close = new Parser(() => { throw new Error("unexpected call"); });

            let parser = between(open, close, p);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errP)
            )).to.be.true;
        }
        // csuc, esuc, csuc
        {
            let stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 2),
                "someO"
            );
            let errO = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            let open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errO, "open", stateO);
            });

            let stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 2),
                "someP"
            );
            let errP = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            let p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.esuc(errP, "nyancat", stateP);
            });

            let stateC = new State(
                new Config({ tabWidth: 8 }),
                "restC",
                new SourcePos("foobar", 1, 3),
                "someC"
            );
            let errC = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            let close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.csuc(errC, "close", stateC);
            });

            let parser = between(open, close, p);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errC, "nyancat", stateC)
            )).to.be.true;
        }
        // csuc, esuc, cerr
        {
            let stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 2),
                "someO"
            );
            let errO = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            let open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errO, "open", stateO);
            });

            let stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 2),
                "someP"
            );
            let errP = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            let p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.esuc(errP, "nyancat", stateP);
            });

            let errC = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            let close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.cerr(errC);
            });

            let parser = between(open, close, p);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errC)
            )).to.be.true;
        }
        // csuc, esuc, esuc
        {
            let stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 2),
                "someO"
            );
            let errO = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            let open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errO, "open", stateO);
            });

            let stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 2),
                "someP"
            );
            let errP = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            let p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.esuc(errP, "nyancat", stateP);
            });

            let stateC = new State(
                new Config({ tabWidth: 8 }),
                "restC",
                new SourcePos("foobar", 1, 2),
                "someC"
            );
            let errC = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            let close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.esuc(errC, "close", stateC);
            });

            let parser = between(open, close, p);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(ParseError.merge(errO, errP), errC), "nyancat", stateC)
            )).to.be.true;
        }
        // csuc, esuc, eerr
        {
            let stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 2),
                "someO"
            );
            let errO = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            let open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errO, "open", stateO);
            });

            let stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 2),
                "someP"
            );
            let errP = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            let p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.esuc(errP, "nyancat", stateP);
            });

            let errC = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            let close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.eerr(errC);
            });

            let parser = between(open, close, p);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(ParseError.merge(errO, errP), errC))
            )).to.be.true;
        }
        // csuc, eerr, *
        {
            let stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 2),
                "someO"
            );
            let errO = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            let open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errO, "open", stateO);
            });

            let errP = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            let p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.eerr(errP);
            });

            let close = new Parser(() => { throw new Error("unexpected call"); });

            let parser = between(open, close, p);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errO, errP))
            )).to.be.true;
        }
        // cerr, *, *
        {
            let errO = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            let open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(errO);
            });

            let p = new Parser(() => { throw new Error("unexpected call"); });

            let close = new Parser(() => { throw new Error("unexpected call"); });

            let parser = between(open, close, p);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errO)
            )).to.be.true;
        }
        // esuc, csuc, csuc
        {
            let stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 1),
                "someO"
            );
            let errO = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            let open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errO, "open", stateO);
            });

            let stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 2),
                "someP"
            );
            let errP = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            let p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.csuc(errP, "nyancat", stateP);
            });

            let stateC = new State(
                new Config({ tabWidth: 8 }),
                "restC",
                new SourcePos("foobar", 1, 3),
                "someC"
            );
            let errC = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            let close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.csuc(errC, "close", stateC);
            });

            let parser = between(open, close, p);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errC, "nyancat", stateC)
            )).to.be.true;
        }
        // esuc, csuc, cerr
        {
            let stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 1),
                "someO"
            );
            let errO = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            let open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errO, "open", stateO);
            });

            let stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 2),
                "someP"
            );
            let errP = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            let p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.csuc(errP, "nyancat", stateP);
            });

            let errC = new ParseError(
                new SourcePos("foobar", 1, 3),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            let close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.cerr(errC);
            });

            let parser = between(open, close, p);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errC)
            )).to.be.true;
        }
        // esuc, csuc, esuc
        {
            let stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 1),
                "someO"
            );
            let errO = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            let open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errO, "open", stateO);
            });

            let stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 2),
                "someP"
            );
            let errP = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            let p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.csuc(errP, "nyancat", stateP);
            });

            let stateC = new State(
                new Config({ tabWidth: 8 }),
                "restC",
                new SourcePos("foobar", 1, 2),
                "someC"
            );
            let errC = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            let close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.esuc(errC, "close", stateC);
            });

            let parser = between(open, close, p);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(ParseError.merge(errP, errC), "nyancat", stateC)
            )).to.be.true;
        }
        // esuc, csuc, eerr
        {
            let stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 1),
                "someO"
            );
            let errO = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            let open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errO, "open", stateO);
            });

            let stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 2),
                "someP"
            );
            let errP = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            let p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.csuc(errP, "nyancat", stateP);
            });

            let errC = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            let close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.eerr(errC);
            });

            let parser = between(open, close, p);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(ParseError.merge(errP, errC))
            )).to.be.true;
        }
        // esuc, cerr, *
        {
            let stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 1),
                "someO"
            );
            let errO = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            let open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errO, "open", stateO);
            });

            let errP = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            let p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.cerr(errP);
            });

            let close = new Parser(() => { throw new Error("unexpected call"); });

            let parser = between(open, close, p);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errP)
            )).to.be.true;
        }
        // esuc, esuc, csuc
        {
            let stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 1),
                "someO"
            );
            let errO = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            let open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errO, "open", stateO);
            });

            let stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 1),
                "someP"
            );
            let errP = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            let p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.esuc(errP, "nyancat", stateP);
            });

            let stateC = new State(
                new Config({ tabWidth: 8 }),
                "restC",
                new SourcePos("foobar", 1, 2),
                "someC"
            );
            let errC = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            let close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.csuc(errC, "close", stateC);
            });

            let parser = between(open, close, p);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(errC, "nyancat", stateC)
            )).to.be.true;
        }
        // esuc, esuc, cerr
        {
            let stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 1),
                "someO"
            );
            let errO = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            let open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errO, "open", stateO);
            });

            let stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 1),
                "someP"
            );
            let errP = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            let p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.esuc(errP, "nyancat", stateP);
            });

            let errC = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            let close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.cerr(errC);
            });

            let parser = between(open, close, p);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(errC)
            )).to.be.true;
        }
        // esuc, esuc, esuc
        {
            let stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 1),
                "someO"
            );
            let errO = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            let open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errO, "open", stateO);
            });

            let stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 1),
                "someP"
            );
            let errP = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            let p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.esuc(errP, "nyancat", stateP);
            });

            let stateC = new State(
                new Config({ tabWidth: 8 }),
                "restC",
                new SourcePos("foobar", 1, 1),
                "someC"
            );
            let errC = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            let close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.esuc(errC, "close", stateC);
            });

            let parser = between(open, close, p);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(ParseError.merge(ParseError.merge(errO, errP), errC), "nyancat", stateC)
            )).to.be.true;
        }
        // esuc, esuc, eerr
        {
            let stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 1),
                "someO"
            );
            let errO = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            let open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errO, "open", stateO);
            });

            let stateP = new State(
                new Config({ tabWidth: 8 }),
                "restP",
                new SourcePos("foobar", 1, 1),
                "someP"
            );
            let errP = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            let p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.esuc(errP, "nyancat", stateP);
            });

            let errC = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
            );
            let close = new Parser(state => {
                expect(State.equal(state, stateP)).to.be.true;
                return Result.eerr(errC);
            });

            let parser = between(open, close, p);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(ParseError.merge(ParseError.merge(errO, errP), errC))
            )).to.be.true;
        }
        // esuc, eerr, *
        {
            let stateO = new State(
                new Config({ tabWidth: 8 }),
                "restO",
                new SourcePos("foobar", 1, 1),
                "someO"
            );
            let errO = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            let open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errO, "open", stateO);
            });

            let errP = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            let p = new Parser(state => {
                expect(State.equal(state, stateO)).to.be.true;
                return Result.eerr(errP);
            });

            let close = new Parser(() => { throw new Error("unexpected call"); });

            let parser = between(open, close, p);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(ParseError.merge(errO, errP))
            )).to.be.true;
        }
        // eerr, *, *
        {
            let errO = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testO")]
            );
            let open = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(errO);
            });

            let p = new Parser(() => { throw new Error("unexpected call"); });

            let close = new Parser(() => { throw new Error("unexpected call"); });

            let parser = between(open, close, p);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(errO)
            )).to.be.true;
        }
    });
});

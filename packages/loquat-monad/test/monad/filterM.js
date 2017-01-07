/*
 * loquat-monad test / monad.filterM()
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

const filterM = _monad.filterM;

describe(".filterM(test, arr)", () => {
    it("should return a parser that applies function `test' to each element of `arr' and runs the returned parser,"
        + " and filters `arr' with the resultant boolean values", () => {
        const arrayEqual = (arrA, arrB) => arrA.length === arrB.length && arrA.every((elem, i) => elem === arrB[i]);

        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );

        function generateFunc(consumed, success, vals, states, errs) {
            return i => new Parser(state => {
                expect(State.equal(state, i === 0 ? initState : states[i - 1])).to.be.true;
                const _consumed = consumed[i];
                const _success  = success[i];
                const _val      = vals[i];
                const _state    = states[i];
                const _err      = errs[i];
                return new Result(_consumed, _success, _err, _val, _state);
            });
        }

        // empty
        {
            const test = generateFunc([], [], [], [], []);
            const parser = filterM(test, []);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(ParseError.unknown(initState.pos), [], initState),
                arrayEqual
            )).to.be.true;
        }
        // csuc, csuc
        {
            const consumed = [true, true];
            const success = [true, true];
            const vals = [true, false];
            const states = [
                new State(
                    new Config({ tabWidth: 8 }),
                    "restA",
                    new SourcePos("foobar", 1, 2),
                    "someA"
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restB",
                    new SourcePos("foobar", 1, 3),
                    "someB"
                )
            ];
            const errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                )
            ];
            const test = generateFunc(consumed, success, vals, states, errs);
            const parser = filterM(test, [0, 1]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                    ),
                    [0],
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restB",
                        new SourcePos("foobar", 1, 3),
                        "someB"
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
        // csuc, cerr
        {
            const consumed = [true, true];
            const success = [true, false];
            const vals = [true];
            const states = [
                new State(
                    new Config({ tabWidth: 8 }),
                    "restA",
                    new SourcePos("foobar", 1, 2),
                    "someA"
                )
            ];
            const errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                )
            ];
            const test = generateFunc(consumed, success, vals, states, errs);
            const parser = filterM(test, [0, 1]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
        // csuc, esuc
        {
            const consumed = [true, false];
            const success = [true, true];
            const vals = [true, false];
            const states = [
                new State(
                    new Config({ tabWidth: 8 }),
                    "restA",
                    new SourcePos("foobar", 1, 2),
                    "someA"
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restB",
                    new SourcePos("foobar", 1, 2),
                    "someB"
                )
            ];
            const errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                )
            ];
            const test = generateFunc(consumed, success, vals, states, errs);
            const parser = filterM(test, [0, 1]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testA"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testB")
                        ]
                    ),
                    [0],
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restB",
                        new SourcePos("foobar", 1, 2),
                        "someB"
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
        // csuc, eerr
        {
            const consumed = [true, false];
            const success = [true, false];
            const vals = [true];
            const states = [
                new State(
                    new Config({ tabWidth: 8 }),
                    "restA",
                    new SourcePos("foobar", 1, 2),
                    "someA"
                )
            ];
            const errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                )
            ];
            const test = generateFunc(consumed, success, vals, states, errs);
            const parser = filterM(test, [0, 1]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testA"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testB")
                        ]
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
        // cerr
        {
            const consumed = [true];
            const success = [false];
            const vals = [];
            const states = [];
            const errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                )
            ];
            const test = generateFunc(consumed, success, vals, states, errs);
            const parser = filterM(test, [0]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
        // esuc, csuc
        {
            const consumed = [false, true];
            const success = [true, true];
            const vals = [true, false];
            const states = [
                new State(
                    new Config({ tabWidth: 8 }),
                    "restA",
                    new SourcePos("foobar", 1, 1),
                    "someA"
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restB",
                    new SourcePos("foobar", 1, 2),
                    "someB"
                )
            ];
            const errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                )
            ];
            const test = generateFunc(consumed, success, vals, states, errs);
            const parser = filterM(test, [0, 1]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                    ),
                    [0],
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restB",
                        new SourcePos("foobar", 1, 2),
                        "someB"
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
        // esuc, cerr
        {
            const consumed = [false, true];
            const success = [true, false];
            const vals = [true];
            const states = [
                new State(
                    new Config({ tabWidth: 8 }),
                    "restA",
                    new SourcePos("foobar", 1, 1),
                    "someA"
                )
            ];
            const errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                )
            ];
            const test = generateFunc(consumed, success, vals, states, errs);
            const parser = filterM(test, [0, 1]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
        // esuc, esuc
        {
            const consumed = [false, false];
            const success = [true, true];
            const vals = [true, false];
            const states = [
                new State(
                    new Config({ tabWidth: 8 }),
                    "restA",
                    new SourcePos("foobar", 1, 1),
                    "someA"
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restB",
                    new SourcePos("foobar", 1, 1),
                    "someB"
                )
            ];
            const errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                )
            ];
            const test = generateFunc(consumed, success, vals, states, errs);
            const parser = filterM(test, [0, 1]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testA"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testB")
                        ]
                    ),
                    [0],
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restB",
                        new SourcePos("foobar", 1, 1),
                        "someB"
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
        // esuc, eerr
        {
            const consumed = [false, false];
            const success = [true, false];
            const vals = [true];
            const states = [
                new State(
                    new Config({ tabWidth: 8 }),
                    "restA",
                    new SourcePos("foobar", 1, 1),
                    "someA"
                )
            ];
            const errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                )
            ];
            const test = generateFunc(consumed, success, vals, states, errs);
            const parser = filterM(test, [0, 1]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testA"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testB")
                        ]
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
        // eerr
        {
            const consumed = [false];
            const success = [false];
            const vals = [];
            const states = [];
            const errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                )
            ];
            const test = generateFunc(consumed, success, vals, states, errs);
            const parser = filterM(test, [0]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
    });
});

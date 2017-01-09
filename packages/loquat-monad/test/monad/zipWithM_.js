/*
 * loquat-monad test / monad.zipWithM_()
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

const zipWithM_ = _monad.zipWithM_;

describe(".zipWithM_(func, arrA, arrB)", () => {
    it("should return a parser that zips arrays with `func', runs the resultant parsers sequentially,"
        + " and discards the resultant values", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );

        function generateFunc(consumed, success, vals, states, errs) {
            return (i, v) => new Parser(state => {
                expect(State.equal(state, i === 0 ? initState : states[i - 1])).to.be.true;
                expect(v).to.equal(vals[i]);
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
            const func = generateFunc([], [], [], [], []);
            const parser = zipWithM_(func, [], []);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(ParseError.unknown(initState.pos), undefined, initState)
            )).to.be.true;
        }
        // csuc, csuc
        {
            const consumed = [true, true];
            const success = [true, true];
            const vals = ["nyan", "cat"];
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
            const func = generateFunc(consumed, success, vals, states, errs);
            const parser = zipWithM_(func, [0, 1], ["nyan", "cat"]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                    ),
                    undefined,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restB",
                        new SourcePos("foobar", 1, 3),
                        "someB"
                    )
                )
            )).to.be.true;
        }
        // csuc, cerr
        {
            const consumed = [true, true];
            const success = [true, false];
            const vals = ["nyan", "cat"];
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
            const func = generateFunc(consumed, success, vals, states, errs);
            const parser = zipWithM_(func, [0, 1], ["nyan", "cat"]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                    )
                )
            )).to.be.true;
        }
        // csuc, esuc
        {
            const consumed = [true, false];
            const success = [true, true];
            const vals = ["nyan", "cat"];
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
            const func = generateFunc(consumed, success, vals, states, errs);
            const parser = zipWithM_(func, [0, 1], ["nyan", "cat"]);
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
                    undefined,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restB",
                        new SourcePos("foobar", 1, 2),
                        "someB"
                    )
                )
            )).to.be.true;
        }
        // csuc, eerr
        {
            const consumed = [true, false];
            const success = [true, false];
            const vals = ["nyan", "cat"];
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
            const func = generateFunc(consumed, success, vals, states, errs);
            const parser = zipWithM_(func, [0, 1], ["nyan", "cat"]);
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
                )
            )).to.be.true;
        }
        // cerr
        {
            const consumed = [true];
            const success = [false];
            const vals = ["nyan", "cat"];
            const states = [];
            const errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                )
            ];
            const func = generateFunc(consumed, success, vals, states, errs);
            const parser = zipWithM_(func, [0], ["nyan", "cat"]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                    )
                )
            )).to.be.true;
        }
        // esuc, csuc
        {
            const consumed = [false, true];
            const success = [true, true];
            const vals = ["nyan", "cat"];
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
            const func = generateFunc(consumed, success, vals, states, errs);
            const parser = zipWithM_(func, [0, 1], ["nyan", "cat"]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                    ),
                    undefined,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restB",
                        new SourcePos("foobar", 1, 2),
                        "someB"
                    )
                )
            )).to.be.true;
        }
        // esuc, cerr
        {
            const consumed = [false, true];
            const success = [true, false];
            const vals = ["nyan", "cat"];
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
            const func = generateFunc(consumed, success, vals, states, errs);
            const parser = zipWithM_(func, [0, 1], ["nyan", "cat"]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                    )
                )
            )).to.be.true;
        }
        // esuc, esuc
        {
            const consumed = [false, false];
            const success = [true, true];
            const vals = ["nyan", "cat"];
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
            const func = generateFunc(consumed, success, vals, states, errs);
            const parser = zipWithM_(func, [0, 1], ["nyan", "cat"]);
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
                    undefined,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restB",
                        new SourcePos("foobar", 1, 1),
                        "someB"
                    )
                )
            )).to.be.true;
        }
        // esuc, eerr
        {
            const consumed = [false, false];
            const success = [true, false];
            const vals = ["nyan", "cat"];
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
            const func = generateFunc(consumed, success, vals, states, errs);
            const parser = zipWithM_(func, [0, 1], ["nyan", "cat"]);
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
                )
            )).to.be.true;
        }
        // eerr
        {
            const consumed = [false];
            const success = [false];
            const vals = ["nyan", "cat"];
            const states = [];
            const errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                )
            ];
            const func = generateFunc(consumed, success, vals, states, errs);
            const parser = zipWithM_(func, [0], ["nyan", "cat"]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                    )
                )
            )).to.be.true;
        }
    });
});

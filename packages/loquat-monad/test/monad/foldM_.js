/*
 * loquat-monad test / monad.foldM_()
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

const foldM_ = _monad.foldM_;

describe(".foldM_(func, initVal, arr)", () => {
    it("should return a parser that call `func' with accumulator and an element of `arr' sequentially,"
        + " runs returned parser, and returns last value as a result", () => {
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );

        function generateFunc(consumed, succeeded, vals, states, errs) {
            return (acc, i) => new Parser(state => {
                expect(State.equal(state, i === 0 ? initState : states[i - 1])).to.be.true;
                let _consumed  = consumed[i];
                let _succeeded = succeeded[i];
                let _val       = acc + vals[i];
                let _state     = states[i];
                let _err       = errs[i];
                return new Result(_consumed, _succeeded, _err, _val, _state);
            });
        }

        // empty
        {
            let func = generateFunc([], [], [], [], []);
            let parser = foldM_(func, "xyz", []);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(ParseError.unknown(initState.pos), undefined, initState)
            )).to.be.true;
        }
        // csuc, csuc
        {
            let consumed = [true, true];
            let succeeded = [true, true];
            let vals = ["nyan", "cat"];
            let states = [
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
            let errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                )
            ];
            let func = generateFunc(consumed, succeeded, vals, states, errs);
            let parser = foldM_(func, "xyz", [0, 1]);
            assertParser(parser);
            let res = parser.run(initState);
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
            let consumed = [true, true];
            let succeeded = [true, false];
            let vals = ["nyan"];
            let states = [
                new State(
                    new Config({ tabWidth: 8 }),
                    "restA",
                    new SourcePos("foobar", 1, 2),
                    "someA"
                )
            ];
            let errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                )
            ];
            let func = generateFunc(consumed, succeeded, vals, states, errs);
            let parser = foldM_(func, "xyz", [0, 1]);
            assertParser(parser);
            let res = parser.run(initState);
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
            let consumed = [true, false];
            let succeeded = [true, true];
            let vals = ["nyan", "cat"];
            let states = [
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
            let errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                )
            ];
            let func = generateFunc(consumed, succeeded, vals, states, errs);
            let parser = foldM_(func, "xyz", [0, 1]);
            assertParser(parser);
            let res = parser.run(initState);
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
            let consumed = [true, false];
            let succeeded = [true, false];
            let vals = ["nyan"];
            let states = [
                new State(
                    new Config({ tabWidth: 8 }),
                    "restA",
                    new SourcePos("foobar", 1, 2),
                    "someA"
                )
            ];
            let errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                )
            ];
            let func = generateFunc(consumed, succeeded, vals, states, errs);
            let parser = foldM_(func, "xyz", [0, 1]);
            assertParser(parser);
            let res = parser.run(initState);
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
            let consumed = [true];
            let succeeded = [false];
            let vals = [];
            let states = [];
            let errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                )
            ];
            let func = generateFunc(consumed, succeeded, vals, states, errs);
            let parser = foldM_(func, "xyz", [0]);
            assertParser(parser);
            let res = parser.run(initState);
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
            let consumed = [false, true];
            let succeeded = [true, true];
            let vals = ["nyan", "cat"];
            let states = [
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
            let errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                )
            ];
            let func = generateFunc(consumed, succeeded, vals, states, errs);
            let parser = foldM_(func, "xyz", [0, 1]);
            assertParser(parser);
            let res = parser.run(initState);
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
            let consumed = [false, true];
            let succeeded = [true, false];
            let vals = ["nyan"];
            let states = [
                new State(
                    new Config({ tabWidth: 8 }),
                    "restA",
                    new SourcePos("foobar", 1, 1),
                    "someA"
                )
            ];
            let errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                )
            ];
            let func = generateFunc(consumed, succeeded, vals, states, errs);
            let parser = foldM_(func, "xyz", [0, 1]);
            assertParser(parser);
            let res = parser.run(initState);
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
            let consumed = [false, false];
            let succeeded = [true, true];
            let vals = ["nyan", "cat"];
            let states = [
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
            let errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                )
            ];
            let func = generateFunc(consumed, succeeded, vals, states, errs);
            let parser = foldM_(func, "xyz", [0, 1]);
            assertParser(parser);
            let res = parser.run(initState);
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
            let consumed = [false, false];
            let succeeded = [true, false];
            let vals = ["nyan"];
            let states = [
                new State(
                    new Config({ tabWidth: 8 }),
                    "restA",
                    new SourcePos("foobar", 1, 1),
                    "someA"
                )
            ];
            let errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                )
            ];
            let func = generateFunc(consumed, succeeded, vals, states, errs);
            let parser = foldM_(func, "xyz", [0, 1]);
            assertParser(parser);
            let res = parser.run(initState);
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
            let consumed = [false];
            let succeeded = [false];
            let vals = [];
            let states = [];
            let errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                )
            ];
            let func = generateFunc(consumed, succeeded, vals, states, errs);
            let parser = foldM_(func, "xyz", [0]);
            assertParser(parser);
            let res = parser.run(initState);
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

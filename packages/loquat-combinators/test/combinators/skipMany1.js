/*
 * loquat-combinators test / combinators.skipMany1()
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

const skipMany1 = _combinators.skipMany1;

describe(".skipMany1(parser)", () => {
    it("should return a parser that skips one or more tokens accepted by `parser' until it empty fails", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "abc",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        function generateParser(consumed, success, vals, states, errs) {
            let i = 0;
            return new Parser(state => {
                expect(State.equal(state, i === 0 ? initState : states[i - 1])).to.be.true;
                const _consumed = consumed[i];
                const _success  = success[i];
                const _val      = vals[i];
                const _state    = states[i];
                const _err      = errs[i];
                i += 1;
                return new Result(_consumed, _success, _err, _val, _state);
            });
        }

        // cerr
        {
            const consumed = [true];
            const success = [false];
            const vals = [];
            const states = [];
            const errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                )
            ];

            const parser = generateParser(consumed, success, vals, states, errs);
            const manyParser = skipMany1(parser);
            assertParser(manyParser);
            const res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                    )
                )
            )).to.be.true;
        }
        // many csuc, cerr
        {
            const consumed = [true, true, true];
            const success = [true, true, false];
            const vals = ["A", "B"];
            const states = [
                new State(
                    new Config({ tabWidth: 4 }),
                    "restA",
                    new SourcePos("foobar", 1, 2),
                    "someA"
                ),
                new State(
                    new Config({ tabWidth: 4 }),
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
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                )
            ];

            const parser = generateParser(consumed, success, vals, states, errs);
            const manyParser = skipMany1(parser);
            assertParser(manyParser);
            const res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                    )
                )
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

            const parser = generateParser(consumed, success, vals, states, errs);
            const manyParser = skipMany1(parser);
            assertParser(manyParser);
            const res = manyParser.run(initState);
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
        // esuc, cerr
        {
            const consumed = [false, true];
            const success = [true, false];
            const vals = ["A"];
            const states = [
                new State(
                    new Config({ tabWidth: 4 }),
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

            const parser = generateParser(consumed, success, vals, states, errs);
            const manyParser = skipMany1(parser);
            assertParser(manyParser);
            const res = manyParser.run(initState);
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
        // esuc, eerr
        {
            const consumed = [false, false];
            const success = [true, false];
            const vals = ["A"];
            const states = [
                new State(
                    new Config({ tabWidth: 4 }),
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

            const parser = generateParser(consumed, success, vals, states, errs);
            const manyParser = skipMany1(parser);
            assertParser(manyParser);
            const res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testA"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testB")
                        ]
                    ),
                    undefined,
                    new State(
                        new Config({ tabWidth: 4 }),
                        "restA",
                        new SourcePos("foobar", 1, 2),
                        "someA"
                    )
                )
            )).to.be.true;
        }
        // many csuc, eerr
        {
            const consumed = [true, true, false];
            const success = [true, true, false];
            const vals = ["A", "B"];
            const states = [
                new State(
                    new Config({ tabWidth: 4 }),
                    "restA",
                    new SourcePos("foobar", 1, 2),
                    "someA"
                ),
                new State(
                    new Config({ tabWidth: 4 }),
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
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                )
            ];

            const parser = generateParser(consumed, success, vals, states, errs);
            const manyParser = skipMany1(parser);
            assertParser(manyParser);
            const res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                    ),
                    undefined,
                    new State(
                        new Config({ tabWidth: 4 }),
                        "restB",
                        new SourcePos("foobar", 1, 3),
                        "someB"
                    )
                )
            )).to.be.true;
        }
    });

    it("should throw an `Error' if `parser' empty succeeds", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "abc",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        function generateParser(consumed, success, vals, states, errs) {
            let i = 0;
            return new Parser(state => {
                expect(State.equal(state, i === 0 ? initState : states[i - 1])).to.be.true;
                const _consumed = consumed[i];
                const _success  = success[i];
                const _val      = vals[i];
                const _state    = states[i];
                const _err      = errs[i];
                i += 1;
                return new Result(_consumed, _success, _err, _val, _state);
            });
        }
        // esuc, esuc, eerr
        {
            const consumed = [false, false, false];
            const success = [true, true, false];
            const vals = ["A", "B"];
            const states = [
                new State(
                    new Config({ tabWidth: 4 }),
                    "restA",
                    new SourcePos("foobar", 1, 2),
                    "someA"
                ),
                new State(
                    new Config({ tabWidth: 4 }),
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
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                )
            ];

            const parser = generateParser(consumed, success, vals, states, errs);
            const manyParser = skipMany1(parser);
            assertParser(manyParser);
            expect(() => { manyParser.run(initState); }).to.throw(Error, /many/);
        }
        // many csuc, esuc, eerr
        {
            const consumed = [true, true, false, false];
            const success = [true, true, true, false];
            const vals = ["A", "B", "C"];
            const states = [
                new State(
                    new Config({ tabWidth: 4 }),
                    "restA",
                    new SourcePos("foobar", 1, 2),
                    "someA"
                ),
                new State(
                    new Config({ tabWidth: 4 }),
                    "restB",
                    new SourcePos("foobar", 1, 3),
                    "someB"
                ),
                new State(
                    new Config({ tabWidth: 4 }),
                    "restC",
                    new SourcePos("foobar", 1, 4),
                    "someC"
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
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 4),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 4),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                )
            ];

            const parser = generateParser(consumed, success, vals, states, errs);
            const manyParser = skipMany1(parser);
            assertParser(manyParser);
            expect(() => { manyParser.run(initState); }).to.throw(Error, /many/);
        }
    });
});

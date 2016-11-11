/*
 * loquat-prim test / prim.many()
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

const many = _prim.many;

describe(".many(parser)", () => {
    it("should return a parser that runs `parser' until it empty fails "
        + "and concats the resultant values into an array", () => {
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "abc",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        function generateParser(consumed, success, vals, states, errs) {
            let i = 0;
            return new Parser(state => {
                expect(State.equal(state, i === 0 ? initState : states[i - 1])).to.be.true;
                let _consumed = consumed[i];
                let _success  = success[i];
                let _val      = vals[i];
                let _state    = states[i];
                let _err      = errs[i];
                i += 1;
                return new Result(_consumed, _success, _err, _val, _state);
            });
        }
        let arrEqual = (xs, ys) => xs.length === ys.length && xs.every((x, i) => x === ys[i]);

        // cerr
        {
            let consumed = [true];
            let success = [false];
            let vals = [];
            let states = [];
            let errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                )
            ];

            let parser = generateParser(consumed, success, vals, states, errs);
            let manyParser = many(parser);
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                    )
                ),
                arrEqual
            )).to.be.true;
        }
        // many csuc, cerr
        {
            let consumed = [true, true, true];
            let success = [true, true, false];
            let vals = ["A", "B"];
            let states = [
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
            let errs = [
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

            let parser = generateParser(consumed, success, vals, states, errs);
            let manyParser = many(parser);
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                    )
                ),
                arrEqual
            )).to.be.true;
        }
        // eerr
        {
            let consumed = [false];
            let success = [false];
            let vals = [];
            let states = [];
            let errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                )
            ];

            let parser = generateParser(consumed, success, vals, states, errs);
            let manyParser = many(parser);
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                    ),
                    [],
                    initState
                ),
                arrEqual
            )).to.be.true;
        }
        // many csuc, eerr
        {
            let consumed = [true, true, false];
            let success = [true, true, false];
            let vals = ["A", "B"];
            let states = [
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
            let errs = [
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

            let parser = generateParser(consumed, success, vals, states, errs);
            let manyParser = many(parser);
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                    ),
                    ["A", "B"],
                    new State(
                        new Config({ tabWidth: 4 }),
                        "restB",
                        new SourcePos("foobar", 1, 3),
                        "someB"
                    )
                ),
                arrEqual
            )).to.be.true;
        }
    });

    it("should throw an `Error' if `parser' empty succeeds", () => {
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "abc",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        function generateParser(consumed, success, vals, states, errs) {
            let i = 0;
            return new Parser(state => {
                expect(State.equal(state, i === 0 ? initState : states[i - 1])).to.be.true;
                let _consumed = consumed[i];
                let _success  = success[i];
                let _val      = vals[i];
                let _state    = states[i];
                let _err      = errs[i];
                i += 1;
                return new Result(_consumed, _success, _err, _val, _state);
            });
        }

        // esuc, eerr
        {
            let consumed = [false, false];
            let success = [true, false];
            let vals = ["A"];
            let states = [
                new State(
                    new Config({ tabWidth: 4 }),
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

            let parser = generateParser(consumed, success, vals, states, errs);
            let manyParser = many(parser);
            assertParser(manyParser);
            expect(() => { manyParser.run(initState); }).to.throw(Error, /many/);
        }
        // many csuc, esuc, eerr
        {
            let consumed = [true, true, false, false];
            let success = [true, true, true, false];
            let vals = ["A", "B", "C"];
            let states = [
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
            let errs = [
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

            let parser = generateParser(consumed, success, vals, states, errs);
            let manyParser = many(parser);
            assertParser(manyParser);
            expect(() => { manyParser.run(initState); }).to.throw(Error, /many/);
        }
    });
});

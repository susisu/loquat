/*
 * loquat-prim test / prim.reduceMany()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const _core = require("loquat-core");
const SourcePos        = _core.SourcePos;
const ErrorMessageType = _core.ErrorMessageType;
const ErrorMessage     = _core.ErrorMessage;
const ParseError       = _core.ParseError;
const Config           = _core.Config;
const State            = _core.State;
const Result           = _core.Result;
const Parser           = _core.Parser;
const assertParser     = _core.assertParser;

const _prim = require("prim.js")(_core);
const reduceMany = _prim.reduceMany;

describe(".reduceMany(parser, callback, initVal)", () => {
    it("should return a parser that runs `parser' until it empty fails "
        + "and reduces the resultant values by `callback'", () => {
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "abc",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        function generateParser(consumed, succeeded, vals, states, errs) {
            let i = 0;
            return new Parser(state => {
                expect(State.equal(state, i === 0 ? initState : states[i - 1])).to.be.true;
                let _consumed  = consumed[i];
                let _succeeded = succeeded[i];
                let _val       = vals[i];
                let _state     = states[i];
                let _err       = errs[i];
                i += 1;
                return new Result(_consumed, _succeeded, _err, _val, _state);
            });
        }

        // cerr
        {
            let consumed = [true];
            let succeeded = [false];
            let vals = [];
            let states = [];
            let errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                )
            ];

            let parser = generateParser(consumed, succeeded, vals, states, errs);
            let manyParser = reduceMany(parser, (x, y) => x + y, "?");
            assertParser(manyParser);
            let res = manyParser.run(initState);
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
            let consumed = [true, true, true];
            let succeeded = [true, true, false];
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

            let parser = generateParser(consumed, succeeded, vals, states, errs);
            let manyParser = reduceMany(parser, (x, y) => x + y, "?");
            assertParser(manyParser);
            let res = manyParser.run(initState);
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

            let parser = generateParser(consumed, succeeded, vals, states, errs);
            let manyParser = reduceMany(parser, (x, y) => x + y, "?");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                    ),
                    "?",
                    initState
                )
            )).to.be.true;
        }
        // many csuc, eerr
        {
            let consumed = [true, true, false];
            let succeeded = [true, true, false];
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

            let parser = generateParser(consumed, succeeded, vals, states, errs);
            let manyParser = reduceMany(parser, (x, y) => x + y, "?");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                    ),
                    "?AB",
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
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "abc",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        function generateParser(consumed, succeeded, vals, states, errs) {
            let i = 0;
            return new Parser(state => {
                expect(State.equal(state, i === 0 ? initState : states[i - 1])).to.be.true;
                let _consumed  = consumed[i];
                let _succeeded = succeeded[i];
                let _val       = vals[i];
                let _state     = states[i];
                let _err       = errs[i];
                i += 1;
                return new Result(_consumed, _succeeded, _err, _val, _state);
            });
        }

        // esuc, eerr
        {
            let consumed = [false, false];
            let succeeded = [true, false];
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

            let parser = generateParser(consumed, succeeded, vals, states, errs);
            let manyParser = reduceMany(parser, (x, y) => x + y, "?");
            assertParser(manyParser);
            expect(() => { manyParser.run(initState); }).to.throw(Error, /many/);
        }
        // many csuc, esuc, eerr
        {
            let consumed = [true, true, false, false];
            let succeeded = [true, true, true, false];
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

            let parser = generateParser(consumed, succeeded, vals, states, errs);
            let manyParser = reduceMany(parser, (x, y) => x + y, "?");
            assertParser(manyParser);
            expect(() => { manyParser.run(initState); }).to.throw(Error, /many/);
        }
    });
});

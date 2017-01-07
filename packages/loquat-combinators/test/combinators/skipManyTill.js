/*
 * loquat-combinators test / combinators.skipManyTill()
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

const skipManyTill = _combinators.skipManyTill;

describe(".skipManyTill(parser, end)", () => {
    it("should return a parser that parses zero or more tokens accepted by `parser' until `end' succeeds,"
        + " and discards the resultant values", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        function generateParsers(consumed, success, vals, states, errs) {
            let i = 0;
            let j = 1;
            return [
                new Parser(state => {
                    expect(State.equal(state, i === 0 ? initState : states[j - 2])).to.be.true;
                    const _consumed = consumed[i];
                    const _success  = success[i];
                    const _val      = vals[i];
                    const _state    = states[i];
                    const _err      = errs[i];
                    i += 2;
                    return new Result(_consumed, _success, _err, _val, _state);
                }),
                new Parser(state => {
                    expect(State.equal(state, i === 2 ? initState : states[j - 2])).to.be.true;
                    const _consumed = consumed[j];
                    const _success  = success[j];
                    const _val      = vals[j];
                    const _state    = states[j];
                    const _err      = errs[j];
                    j += 2;
                    return new Result(_consumed, _success, _err, _val, _state);
                })
            ];
        }
        // empty csuc
        {
            const consumed = [true];
            const success = [true];
            const vals = [undefined];
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
                )
            ];
            const parsers = generateParsers(consumed, success, vals, states, errs);
            const parser = skipManyTill(parsers[1], parsers[0]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                    ),
                    undefined,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restA",
                        new SourcePos("foobar", 1, 2),
                        "someA"
                    )
                )
            )).to.be.true;
        }
        // many csuc, ended by csuc
        {
            const consumed = [false, true, false, true, true];
            const success = [false, true, false, true, true];
            const vals = [undefined, "nyan", undefined, "cat", undefined];
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
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restC",
                    new SourcePos("foobar", 1, 2),
                    "someC"
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restD",
                    new SourcePos("foobar", 1, 3),
                    "someD"
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restE",
                    new SourcePos("foobar", 1, 4),
                    "someE"
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
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 4),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testE")]
                )
            ];
            const parsers = generateParsers(consumed, success, vals, states, errs);
            const parser = skipManyTill(parsers[1], parsers[0]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 4),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testE")]
                    ),
                    undefined,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restE",
                        new SourcePos("foobar", 1, 4),
                        "someE"
                    )
                )
            )).to.be.true;
        }
        // many esuc, ended by csuc
        {
            const consumed = [false, false, false, false, true];
            const success = [false, true, false, true, true];
            const vals = [undefined, "nyan", undefined, "cat", undefined];
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
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restC",
                    new SourcePos("foobar", 1, 1),
                    "someC"
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restD",
                    new SourcePos("foobar", 1, 1),
                    "someD"
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restE",
                    new SourcePos("foobar", 1, 2),
                    "someE"
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
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testE")]
                )
            ];
            const parsers = generateParsers(consumed, success, vals, states, errs);
            const parser = skipManyTill(parsers[1], parsers[0]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testE")]
                    ),
                    undefined,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restE",
                        new SourcePos("foobar", 1, 2),
                        "someE"
                    )
                )
            )).to.be.true;
        }
        // empty cerr
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
            const parsers = generateParsers(consumed, success, vals, states, errs);
            const parser = skipManyTill(parsers[1], parsers[0]);
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
        // many csuc, ended by cerr
        {
            const consumed = [false, true, false, true, true];
            const success = [false, true, false, true, false];
            const vals = [undefined, "nyan", undefined, "cat"];
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
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restC",
                    new SourcePos("foobar", 1, 2),
                    "someC"
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restD",
                    new SourcePos("foobar", 1, 3),
                    "someD"
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
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 4),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testE")]
                )
            ];
            const parsers = generateParsers(consumed, success, vals, states, errs);
            const parser = skipManyTill(parsers[1], parsers[0]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 4),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testE")]
                    )
                )
            )).to.be.true;
        }
        // many esuc, ended by cerr
        {
            const consumed = [false, false, false, false, true];
            const success = [false, true, false, true, false];
            const vals = [undefined, "nyan", undefined, "cat"];
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
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restC",
                    new SourcePos("foobar", 1, 1),
                    "someC"
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restD",
                    new SourcePos("foobar", 1, 1),
                    "someD"
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
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testE")]
                )
            ];
            const parsers = generateParsers(consumed, success, vals, states, errs);
            const parser = skipManyTill(parsers[1], parsers[0]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testE")]
                    )
                )
            )).to.be.true;
        }
        // empty esuc
        {
            const consumed = [false];
            const success = [true];
            const vals = [undefined];
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
                )
            ];
            const parsers = generateParsers(consumed, success, vals, states, errs);
            const parser = skipManyTill(parsers[1], parsers[0]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                    ),
                    undefined,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restA",
                        new SourcePos("foobar", 1, 1),
                        "someA"
                    )
                )
            )).to.be.true;
        }
        // many csuc, ended by esuc
        {
            const consumed = [false, true, false, true, false];
            const success = [false, true, false, true, true];
            const vals = [undefined, "nyan", undefined, "cat", undefined];
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
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restC",
                    new SourcePos("foobar", 1, 2),
                    "someC"
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restD",
                    new SourcePos("foobar", 1, 3),
                    "someD"
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restE",
                    new SourcePos("foobar", 1, 3),
                    "someE"
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
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testE")]
                )
            ];
            const parsers = generateParsers(consumed, success, vals, states, errs);
            const parser = skipManyTill(parsers[1], parsers[0]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testD"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testE")
                        ]
                    ),
                    undefined,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restE",
                        new SourcePos("foobar", 1, 3),
                        "someE"
                    )
                )
            )).to.be.true;
        }
        // many esuc, ended by esuc
        {
            const consumed = [false, false, false, false, false];
            const success = [false, true, false, true, true];
            const vals = [undefined, "nyan", undefined, "cat", undefined];
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
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restC",
                    new SourcePos("foobar", 1, 1),
                    "someC"
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restD",
                    new SourcePos("foobar", 1, 1),
                    "someD"
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restE",
                    new SourcePos("foobar", 1, 1),
                    "someE"
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
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testE")]
                )
            ];
            const parsers = generateParsers(consumed, success, vals, states, errs);
            const parser = skipManyTill(parsers[1], parsers[0]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testA"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testB"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testC"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testD"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testE")
                        ]
                    ),
                    undefined,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restE",
                        new SourcePos("foobar", 1, 1),
                        "someE"
                    )
                )
            )).to.be.true;
        }
        // cerr
        {
            const consumed = [false, true];
            const success = [false, false];
            const vals = [];
            const states = [];
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
            const parsers = generateParsers(consumed, success, vals, states, errs);
            const parser = skipManyTill(parsers[1], parsers[0]);
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
        // many csuc, cerr
        {
            const consumed = [false, true, false, true, false, true];
            const success = [false, true, false, true, false, false];
            const vals = [undefined, "nyan", undefined, "cat", undefined];
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
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restC",
                    new SourcePos("foobar", 1, 2),
                    "someC"
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restD",
                    new SourcePos("foobar", 1, 3),
                    "someD"
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restE",
                    new SourcePos("foobar", 1, 3),
                    "someE"
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
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testE")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 4),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testF")]
                )
            ];
            const parsers = generateParsers(consumed, success, vals, states, errs);
            const parser = skipManyTill(parsers[1], parsers[0]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 4),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testF")]
                    )
                )
            )).to.be.true;
        }
        // eerr
        {
            const consumed = [false, false];
            const success = [false, false];
            const vals = [];
            const states = [];
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
            const parsers = generateParsers(consumed, success, vals, states, errs);
            const parser = skipManyTill(parsers[1], parsers[0]);
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
        // many csuc, eerr
        {
            const consumed = [false, true, false, true, false, false];
            const success = [false, true, false, true, false, false];
            const vals = [undefined, "nyan", undefined, "cat", undefined];
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
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restC",
                    new SourcePos("foobar", 1, 2),
                    "someC"
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restD",
                    new SourcePos("foobar", 1, 3),
                    "someD"
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restE",
                    new SourcePos("foobar", 1, 3),
                    "someE"
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
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testE")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testF")]
                )
            ];
            const parsers = generateParsers(consumed, success, vals, states, errs);
            const parser = skipManyTill(parsers[1], parsers[0]);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testD"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testE"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testF")
                        ]
                    )
                )
            )).to.be.true;
        }
    });
});

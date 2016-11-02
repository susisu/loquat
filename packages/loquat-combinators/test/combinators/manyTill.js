/*
 * loquat-combinators test / combinators.manyTill()
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

const manyTill = _combinators.manyTill;

describe(".manyTill(parser, end)", () => {
    it("should return a parser that parses zero or more tokens accepted by `parser' until `end' succeeds", () => {
        let arrayEqual = (arrA, arrB) => arrA.length === arrB.length && arrA.every((elem, i) => elem === arrB[i]);

        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        function generateParsers(consumed, succeeded, vals, states, errs) {
            let i = 0;
            let j = 1;
            return [
                new Parser(state => {
                    expect(State.equal(state, i === 0 ? initState : states[j - 2])).to.be.true;
                    let _consumed  = consumed[i];
                    let _succeeded = succeeded[i];
                    let _val       = vals[i];
                    let _state     = states[i];
                    let _err       = errs[i];
                    i += 2;
                    return new Result(_consumed, _succeeded, _err, _val, _state);
                }),
                new Parser(state => {
                    expect(State.equal(state, i === 2 ? initState : states[j - 2])).to.be.true;
                    let _consumed  = consumed[j];
                    let _succeeded = succeeded[j];
                    let _val       = vals[j];
                    let _state     = states[j];
                    let _err       = errs[j];
                    j += 2;
                    return new Result(_consumed, _succeeded, _err, _val, _state);
                })
            ];
        }
        // empty csuc
        {
            let consumed = [true];
            let succeeded = [true];
            let vals = [undefined];
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
                )
            ];
            let parsers = generateParsers(consumed, succeeded, vals, states, errs);
            let parser = manyTill(parsers[1], parsers[0]);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                    ),
                    [],
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restA",
                        new SourcePos("foobar", 1, 2),
                        "someA"
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
        // many csuc, ended by csuc
        {
            let consumed = [false, true, false, true, true];
            let succeeded = [false, true, false, true, true];
            let vals = [undefined, "nyan", undefined, "cat", undefined];
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
            let errs = [
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
            let parsers = generateParsers(consumed, succeeded, vals, states, errs);
            let parser = manyTill(parsers[1], parsers[0]);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 4),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testE")]
                    ),
                    ["nyan", "cat"],
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restE",
                        new SourcePos("foobar", 1, 4),
                        "someE"
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
        // many esuc, ended by csuc
        {
            let consumed = [false, false, false, false, true];
            let succeeded = [false, true, false, true, true];
            let vals = [undefined, "nyan", undefined, "cat", undefined];
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
            let errs = [
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
            let parsers = generateParsers(consumed, succeeded, vals, states, errs);
            let parser = manyTill(parsers[1], parsers[0]);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testE")]
                    ),
                    ["nyan", "cat"],
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restE",
                        new SourcePos("foobar", 1, 2),
                        "someE"
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
        // empty cerr
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
            let parsers = generateParsers(consumed, succeeded, vals, states, errs);
            let parser = manyTill(parsers[1], parsers[0]);
            assertParser(parser);
            let res = parser.run(initState);
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
        // many csuc, ended by cerr
        {
            let consumed = [false, true, false, true, true];
            let succeeded = [false, true, false, true, false];
            let vals = [undefined, "nyan", undefined, "cat"];
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
            let errs = [
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
            let parsers = generateParsers(consumed, succeeded, vals, states, errs);
            let parser = manyTill(parsers[1], parsers[0]);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 4),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testE")]
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
        // many esuc, ended by cerr
        {
            let consumed = [false, false, false, false, true];
            let succeeded = [false, true, false, true, false];
            let vals = [undefined, "nyan", undefined, "cat"];
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
            let errs = [
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
            let parsers = generateParsers(consumed, succeeded, vals, states, errs);
            let parser = manyTill(parsers[1], parsers[0]);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testE")]
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
        // empty esuc
        {
            let consumed = [false];
            let succeeded = [true];
            let vals = [undefined];
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
                )
            ];
            let parsers = generateParsers(consumed, succeeded, vals, states, errs);
            let parser = manyTill(parsers[1], parsers[0]);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                    ),
                    [],
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restA",
                        new SourcePos("foobar", 1, 1),
                        "someA"
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
        // many csuc, ended by esuc
        {
            let consumed = [false, true, false, true, false];
            let succeeded = [false, true, false, true, true];
            let vals = [undefined, "nyan", undefined, "cat", undefined];
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
            let errs = [
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
            let parsers = generateParsers(consumed, succeeded, vals, states, errs);
            let parser = manyTill(parsers[1], parsers[0]);
            assertParser(parser);
            let res = parser.run(initState);
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
                    ["nyan", "cat"],
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restE",
                        new SourcePos("foobar", 1, 3),
                        "someE"
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
        // many esuc, ended by esuc
        {
            let consumed = [false, false, false, false, false];
            let succeeded = [false, true, false, true, true];
            let vals = [undefined, "nyan", undefined, "cat", undefined];
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
            let errs = [
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
            let parsers = generateParsers(consumed, succeeded, vals, states, errs);
            let parser = manyTill(parsers[1], parsers[0]);
            assertParser(parser);
            let res = parser.run(initState);
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
                    ["nyan", "cat"],
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restE",
                        new SourcePos("foobar", 1, 1),
                        "someE"
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
    });
});

/*
 * loquat-combinators test / combinators.chainr()
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

const chainr = _combinators.chainr;

describe(".chainr(term, op, defaultVal)", () => {
    it("should return a parser that parses zero or more terms accepted by `term' and operators accepted by `op',"
        + " and reduces the values to a single value from right to left", () => {
        let initState = new State(
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
                    let _consumed = consumed[i];
                    let _success  = success[i];
                    let _val      = vals[i];
                    let _state    = states[i];
                    let _err      = errs[i];
                    i += 2;
                    return new Result(_consumed, _success, _err, _val, _state);
                }),
                new Parser(state => {
                    expect(State.equal(state, states[i - 2])).to.be.true;
                    let _consumed = consumed[j];
                    let _success  = success[j];
                    let _val      = vals[j];
                    let _state    = states[j];
                    let _err      = errs[j];
                    j += 2;
                    return new Result(_consumed, _success, _err, _val, _state);
                })
            ];
        }
        // csuc, csuc, csuc, cerr
        {
            let consumed = [true, true, true, true];
            let success = [true, true, true, false];
            let vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
                ),
                new State(
                    new Config({ tabWidth: 8 }),
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
                    new SourcePos("foobar", 1, 5),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 5),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                    )
                )
            )).to.be.true;
        }
        // csuc, csuc, csuc, eerr
        {
            let consumed = [true, true, true, false];
            let success = [true, true, true, false];
            let vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
                ),
                new State(
                    new Config({ tabWidth: 8 }),
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
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 4),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testC"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testD")
                        ]
                    ),
                    "nyanCAT",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restC",
                        new SourcePos("foobar", 1, 4),
                        "someC"
                    )
                )
            )).to.be.true;
        }
        // csuc, csuc, cerr
        {
            let consumed = [true, true, true];
            let success = [true, true, false];
            let vals = ["nyan", (x, y) => x + y.toUpperCase()];
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
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 4),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 4),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                    )
                )
            )).to.be.true;
        }
        // csuc, csuc, esuc, cerr
        {
            let consumed = [true, true, false, true];
            let success = [true, true, true, false];
            let vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restC",
                    new SourcePos("foobar", 1, 3),
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
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 4),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 4),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                    )
                )
            )).to.be.true;
        }
        // csuc, csuc, esuc, eerr
        {
            let consumed = [true, true, false, false];
            let success = [true, true, true, false];
            let vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restC",
                    new SourcePos("foobar", 1, 3),
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
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testB"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testC"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testD")
                        ]
                    ),
                    "nyanCAT",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restC",
                        new SourcePos("foobar", 1, 3),
                        "someC"
                    )
                )
            )).to.be.true;
        }
        // csuc, csuc, eerr
        {
            let consumed = [true, true, false];
            let success = [true, true, false];
            let vals = ["nyan", (x, y) => x + y.toUpperCase()];
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
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testB"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testC")
                        ]
                    )
                )
            )).to.be.true;
        }
        // csuc, cerr
        {
            let consumed = [true, true];
            let success = [true, false];
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
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
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
        // csuc, esuc, csuc, cerr
        {
            let consumed = [true, false, true, true];
            let success = [true, true, true, false];
            let vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restC",
                    new SourcePos("foobar", 1, 3),
                    "someC"
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
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 4),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 4),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                    )
                )
            )).to.be.true;
        }
        // csuc, esuc, csuc, eerr
        {
            let consumed = [true, false, true, false];
            let success = [true, true, true, false];
            let vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restC",
                    new SourcePos("foobar", 1, 3),
                    "someC"
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
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testC"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testD")
                        ]
                    ),
                    "nyanCAT",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restC",
                        new SourcePos("foobar", 1, 3),
                        "someC"
                    )
                )
            )).to.be.true;
        }
        // csuc, esuc, cerr
        {
            let consumed = [true, false, true];
            let success = [true, true, false];
            let vals = ["nyan", (x, y) => x + y.toUpperCase()];
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
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
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
        // csuc, esuc, esuc, cerr
        {
            let consumed = [true, false, false, true];
            let success = [true, true, true, false];
            let vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restC",
                    new SourcePos("foobar", 1, 2),
                    "someC"
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
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                    )
                )
            )).to.be.true;
        }
        // csuc, esuc, esuc, eerr
        {
            let consumed = [true, false, false, false];
            let success = [true, true, true, false];
            let vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restC",
                    new SourcePos("foobar", 1, 2),
                    "someC"
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
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testA"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testB"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testC"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testD")
                        ]
                    ),
                    "nyanCAT",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restC",
                        new SourcePos("foobar", 1, 2),
                        "someC"
                    )
                )
            )).to.be.true;
        }
        // csuc, esuc, eerr
        {
            let consumed = [true, false, false];
            let success = [true, true, false];
            let vals = ["nyan", (x, y) => x + y.toUpperCase()];
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
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testA"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testB"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testC")
                        ]
                    ),
                    "nyan",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restA",
                        new SourcePos("foobar", 1, 2),
                        "someA"
                    )
                )
            )).to.be.true;
        }
        // csuc, eerr
        {
            let consumed = [true, false];
            let success = [true, false];
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
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
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
                    "nyan",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restA",
                        new SourcePos("foobar", 1, 2),
                        "someA"
                    )
                )
            )).to.be.true;
        }
        // cerr
        {
            let consumed = [true];
            let success = [false];
            let vals = [];
            let states = [];
            let errs = [
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
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
        // esuc, csuc, csuc, cerr
        {
            let consumed = [false, true, true, true];
            let success = [true, true, true, false];
            let vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
                    new SourcePos("foobar", 1, 3),
                    "someC"
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
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 4),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 4),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                    )
                )
            )).to.be.true;
        }
        // esuc, csuc, csuc, eerr
        {
            let consumed = [false, true, true, false];
            let success = [true, true, true, false];
            let vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
                    new SourcePos("foobar", 1, 3),
                    "someC"
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
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testC"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testD")
                        ]
                    ),
                    "nyanCAT",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restC",
                        new SourcePos("foobar", 1, 3),
                        "someC"
                    )
                )
            )).to.be.true;
        }
        // esuc, csuc, cerr
        {
            let consumed = [false, true, true];
            let success = [true, true, false];
            let vals = ["nyan", (x, y) => x + y.toUpperCase()];
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
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
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
        // esuc, csuc, esuc, cerr
        {
            let consumed = [false, true, false, true];
            let success = [true, true, true, false];
            let vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                    )
                )
            )).to.be.true;
        }
        // esuc, csuc, esuc, eerr
        {
            let consumed = [false, true, false, false];
            let success = [true, true, true, false];
            let vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testB"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testC"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testD")
                        ]
                    ),
                    "nyanCAT",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restC",
                        new SourcePos("foobar", 1, 2),
                        "someC"
                    )
                )
            )).to.be.true;
        }
        // esuc, csuc, eerr
        {
            let consumed = [false, true, false];
            let success = [true, true, false];
            let vals = ["nyan", (x, y) => x + y.toUpperCase()];
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
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testB"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testC")
                        ]
                    )
                )
            )).to.be.true;
        }
        // esuc, cerr
        {
            let consumed = [false, true];
            let success = [true, false];
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
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
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
        // esuc, esuc, csuc, cerr
        {
            let consumed = [false, false, true, true];
            let success = [true, true, true, false];
            let vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
                    new SourcePos("foobar", 1, 2),
                    "someC"
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
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 3),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                    )
                )
            )).to.be.true;
        }
        // esuc, esuc, csuc, eerr
        {
            let consumed = [false, false, true, false];
            let success = [true, true, true, false];
            let vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
                    new SourcePos("foobar", 1, 2),
                    "someC"
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
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testC"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testD")
                        ]
                    ),
                    "nyanCAT",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restC",
                        new SourcePos("foobar", 1, 2),
                        "someC"
                    )
                )
            )).to.be.true;
        }
        // esuc, esuc, cerr
        {
            let consumed = [false, false, true];
            let success = [true, true, false];
            let vals = ["nyan", (x, y) => x + y.toUpperCase()];
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
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                    )
                )
            )).to.be.true;
        }
        // esuc, esuc, esuc, cerr
        {
            let consumed = [false, false, false, true];
            let success = [true, true, true, false];
            let vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                    )
                )
            )).to.be.true;
        }
        // esuc, esuc, esuc, eerr
        {
            let consumed = [false, false, false, false];
            let success = [true, true, true, false];
            let vals = ["nyan", (x, y) => x + y.toUpperCase(), "cat"];
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
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testA"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testB"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testC"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testD")
                        ]
                    ),
                    "nyanCAT",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restC",
                        new SourcePos("foobar", 1, 1),
                        "someC"
                    )
                )
            )).to.be.true;
        }
        // esuc, esuc, eerr
        {
            let consumed = [false, false, false];
            let success = [true, true, false];
            let vals = ["nyan", (x, y) => x + y.toUpperCase()];
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
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testC")]
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testA"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testB"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testC")
                        ]
                    ),
                    "nyan",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restA",
                        new SourcePos("foobar", 1, 1),
                        "someA"
                    )
                )
            )).to.be.true;
        }
        // esuc, eerr
        {
            let consumed = [false, false];
            let success = [true, false];
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
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
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
                    "nyan",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restA",
                        new SourcePos("foobar", 1, 1),
                        "someA"
                    )
                )
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
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                    ),
                    "xyz",
                    initState
                )
            )).to.be.true;
        }
        // right to left: csuc, csuc, csuc, csuc, csuc, eerr
        {
            let consumed = [true, true, true, true, true, false];
            let success = [true, true, true, true, true, false];
            let vals = [
                "c",
                (x, y) => x + y.toUpperCase(),
                "a",
                (x, y) => x + y.toLowerCase(),
                "T"
            ];
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
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restC",
                    new SourcePos("foobar", 1, 4),
                    "someC"
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restD",
                    new SourcePos("foobar", 1, 5),
                    "someD"
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restE",
                    new SourcePos("foobar", 1, 6),
                    "someE"
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
                    new SourcePos("foobar", 1, 5),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 6),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testE")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 6),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testF")]
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1], "xyz");
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 6),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testE"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testF")
                        ]
                    ),
                    "cAT",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restE",
                        new SourcePos("foobar", 1, 6),
                        "someE"
                    )
                )
            )).to.be.true;
        }
                // right to left: csuc, csuc, csuc, csuc, csuc, esuc, eerr
        {
            let consumed = [true, true, true, true, true, false, false];
            let success = [true, true, true, true, true, true, false];
            let vals = [
                "c",
                (x, y) => x + y.toUpperCase(),
                "a",
                (x, y) => x + y.toLowerCase(),
                "T",
                (x, y) => x + y.toUpperCase()
            ];
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
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restC",
                    new SourcePos("foobar", 1, 4),
                    "someC"
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restD",
                    new SourcePos("foobar", 1, 5),
                    "someD"
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restE",
                    new SourcePos("foobar", 1, 6),
                    "someE"
                ),
                new State(
                    new Config({ tabWidth: 8 }),
                    "restF",
                    new SourcePos("foobar", 1, 6),
                    "someF"
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
                    new SourcePos("foobar", 1, 5),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testD")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 6),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testE")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 6),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testF")]
                ),
                new ParseError(
                    new SourcePos("foobar", 1, 6),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "testG")]
                )
            ];
            let parsers = generateParsers(consumed, success, vals, states, errs);
            let manyParser = chainr(parsers[0], parsers[1]);
            assertParser(manyParser);
            let res = manyParser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 6),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testE"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testF"),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "testG")
                        ]
                    ),
                    "cAT",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "restE",
                        new SourcePos("foobar", 1, 6),
                        "someE"
                    )
                )
            )).to.be.true;
        }
    });
});

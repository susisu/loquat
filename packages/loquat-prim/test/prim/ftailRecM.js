/*
 * loquat-prim test / prim.ftailRecM()
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

const ftailRecM = _prim.ftailRecM;

describe(".ftailRecM(func)", () => {
    it("should return a function that takes an initial value and calls `func' repeatedly"
        + " until returned parser succeeds with done", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        const initVal = "abc";
        function generateFunc(consumed, success, vals, states, errs) {
            let i = 0;
            const len = consumed.length;
            return ftailRecM(val => {
                expect(val).to.equal(i === 0 ? initVal : vals[i - 1]);
                return new Parser(state => {
                    expect(State.equal(state, i === 0 ? initState : states[i - 1]));
                    const _consumed = consumed[i];
                    const _success  = success[i];
                    const _val      = { done: i === len - 1, value: vals[i] };
                    const _state    = states[i];
                    const _err      = errs[i];
                    i += 1;
                    return new Result(_consumed, _success, _err, _val, _state);
                });
            });
        }
        // immediately done
        {
            // csuc
            {
                const finalState = new State(
                    new Config({ tabWidth: 4 }),
                    "rest",
                    new SourcePos("foobar", 1, 2),
                    "some"
                );
                const err = new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                );
                const func = ftailRecM(val => {
                    expect(val).to.equal("nyan");
                    return new Parser(state => {
                        expect(State.equal(state, initState));
                        return Result.csuc(err, { done: true, value: "cat" }, finalState);
                    });
                });
                const parser = func("nyan");
                assertParser(parser);
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(
                        err,
                        "cat",
                        finalState
                    )
                )).to.be.true;
            }
            // cerr
            {
                const err = new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                );
                const func = ftailRecM(val => {
                    expect(val).to.equal("nyan");
                    return new Parser(state => {
                        expect(State.equal(state, initState));
                        return Result.cerr(err);
                    });
                });
                const parser = func("nyan");
                assertParser(parser);
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.cerr(err)
                )).to.be.true;
            }
            // esuc
            {
                const finalState = new State(
                    new Config({ tabWidth: 4 }),
                    "rest",
                    new SourcePos("foobar", 1, 1),
                    "some"
                );
                const err = new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                );
                const func = ftailRecM(val => {
                    expect(val).to.equal("nyan");
                    return new Parser(state => {
                        expect(State.equal(state, initState));
                        return Result.esuc(err, { done: true, value: "cat" }, finalState);
                    });
                });
                const parser = func("nyan");
                assertParser(parser);
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.esuc(
                        err,
                        "cat",
                        finalState
                    )
                )).to.be.true;
            }
            // eerr
            {
                const err = new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                );
                const func = ftailRecM(val => {
                    expect(val).to.equal("nyan");
                    return new Parser(state => {
                        expect(State.equal(state, initState));
                        return Result.eerr(err);
                    });
                });
                const parser = func("nyan");
                assertParser(parser);
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.eerr(err)
                )).to.be.true;
            }
        }
        // recursive
        {
            // csuc, csuc
            {
                const consumed = [true, true];
                const success = [true, true];
                const vals = ["nyan", "cat"];
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
                    )
                ];
                const func = generateFunc(consumed, success, vals, states, errs);
                const parser = func(initVal);
                assertParser(parser);
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 3),
                            [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                        ),
                        "cat",
                        new State(
                            new Config({ tabWidth: 4 }),
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
                const vals = ["nyan"];
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
                        new SourcePos("foobar", 1, 3),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                    )
                ];
                const func = generateFunc(consumed, success, vals, states, errs);
                const parser = func(initVal);
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
                        new Config({ tabWidth: 4 }),
                        "restA",
                        new SourcePos("foobar", 1, 2),
                        "someA"
                    ),
                    new State(
                        new Config({ tabWidth: 4 }),
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
                const parser = func(initVal);
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
                        "cat",
                        new State(
                            new Config({ tabWidth: 4 }),
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
                const vals = ["nyan"];
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
                const func = generateFunc(consumed, success, vals, states, errs);
                const parser = func(initVal);
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
                const vals = [];
                const states = [];
                const errs = [
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                    )
                ];
                const func = generateFunc(consumed, success, vals, states, errs);
                const parser = func(initVal);
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
                        new Config({ tabWidth: 4 }),
                        "restA",
                        new SourcePos("foobar", 1, 1),
                        "someA"
                    ),
                    new State(
                        new Config({ tabWidth: 4 }),
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
                const parser = func(initVal);
                assertParser(parser);
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 2),
                            [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                        ),
                        "cat",
                        new State(
                            new Config({ tabWidth: 4 }),
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
                const vals = ["nyan"];
                const states = [
                    new State(
                        new Config({ tabWidth: 4 }),
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
                const parser = func(initVal);
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
                        new Config({ tabWidth: 4 }),
                        "restA",
                        new SourcePos("foobar", 1, 1),
                        "someA"
                    ),
                    new State(
                        new Config({ tabWidth: 4 }),
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
                const parser = func(initVal);
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
                        "cat",
                        new State(
                            new Config({ tabWidth: 4 }),
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
                const vals = ["nyan"];
                const states = [
                    new State(
                        new Config({ tabWidth: 4 }),
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
                const parser = func(initVal);
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
                const vals = [];
                const states = [];
                const errs = [
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                    )
                ];
                const func = generateFunc(consumed, success, vals, states, errs);
                const parser = func(initVal);
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
        }
    });
});

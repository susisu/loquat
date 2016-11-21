/*
 * loquat-prim test / prim.tailRecM()
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

const pure     = _prim.pure;
const bind     = _prim.bind;
const tailRecM = _prim.tailRecM;

describe(".tailRecM(initVal, func)", () => {
    it("should return a parser that calls `func' with `initValue', runs the returned parser,"
        + " and repeats it until parser returnes done", () => {
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        let initVal = "abc";
        function generateFunc(consumed, success, vals, states, errs) {
            let i = 0;
            let len = consumed.length;
            return val => {
                expect(val).to.equal(i === 0 ? initVal : vals[i - 1]);
                return new Parser(state => {
                    expect(State.equal(state, i === 0 ? initState : states[i - 1]));
                    let _consumed = consumed[i];
                    let _success  = success[i];
                    let _val      = { done: i === len - 1, value: vals[i] };
                    let _state    = states[i];
                    let _err      = errs[i];
                    i += 1;
                    return new Result(_consumed, _success, _err, _val, _state);
                });
            };
        }
        // immediately done
        {
            // csuc
            {
                let finalState = new State(
                    new Config({ tabWidth: 4 }),
                    "rest",
                    new SourcePos("foobar", 1, 2),
                    "some"
                );
                let err = new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                );
                let func = val => {
                    expect(val).to.equal("nyan");
                    return new Parser(state => {
                        expect(State.equal(state, initState));
                        return Result.csuc(err, { done: true, value: "cat" }, finalState);
                    });
                };
                let parser = tailRecM("nyan", func);
                assertParser(parser);
                let res = parser.run(initState);
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
                let err = new ParseError(
                    new SourcePos("foobar", 1, 2),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                );
                let func = val => {
                    expect(val).to.equal("nyan");
                    return new Parser(state => {
                        expect(State.equal(state, initState));
                        return Result.cerr(err);
                    });
                };
                let parser = tailRecM("nyan", func);
                assertParser(parser);
                let res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.cerr(err)
                )).to.be.true;
            }
            // esuc
            {
                let finalState = new State(
                    new Config({ tabWidth: 4 }),
                    "rest",
                    new SourcePos("foobar", 1, 1),
                    "some"
                );
                let err = new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                );
                let func = val => {
                    expect(val).to.equal("nyan");
                    return new Parser(state => {
                        expect(State.equal(state, initState));
                        return Result.esuc(err, { done: true, value: "cat" }, finalState);
                    });
                };
                let parser = tailRecM("nyan", func);
                assertParser(parser);
                let res = parser.run(initState);
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
                let err = new ParseError(
                    new SourcePos("foobar", 1, 1),
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                );
                let func = val => {
                    expect(val).to.equal("nyan");
                    return new Parser(state => {
                        expect(State.equal(state, initState));
                        return Result.eerr(err);
                    });
                };
                let parser = tailRecM("nyan", func);
                assertParser(parser);
                let res = parser.run(initState);
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
                let consumed = [true, true];
                let success = [true, true];
                let vals = ["nyan", "cat"];
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
                    )
                ];
                let func = generateFunc(consumed, success, vals, states, errs);
                let parser = tailRecM(initVal, func);
                assertParser(parser);
                let res = parser.run(initState);
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
                let consumed = [true, true];
                let success = [true, false];
                let vals = ["nyan"];
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
                        new SourcePos("foobar", 1, 3),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
                    )
                ];
                let func = generateFunc(consumed, success, vals, states, errs);
                let parser = tailRecM(initVal, func);
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
                let success = [true, true];
                let vals = ["nyan", "cat"];
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
                let func = generateFunc(consumed, success, vals, states, errs);
                let parser = tailRecM(initVal, func);
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
                let consumed = [true, false];
                let success = [true, false];
                let vals = ["nyan"];
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
                let func = generateFunc(consumed, success, vals, states, errs);
                let parser = tailRecM(initVal, func);
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
                let success = [false];
                let vals = [];
                let states = [];
                let errs = [
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                    )
                ];
                let func = generateFunc(consumed, success, vals, states, errs);
                let parser = tailRecM(initVal, func);
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
                let success = [true, true];
                let vals = ["nyan", "cat"];
                let states = [
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
                let func = generateFunc(consumed, success, vals, states, errs);
                let parser = tailRecM(initVal, func);
                assertParser(parser);
                let res = parser.run(initState);
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
                let consumed = [false, true];
                let success = [true, false];
                let vals = ["nyan"];
                let states = [
                    new State(
                        new Config({ tabWidth: 4 }),
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
                let func = generateFunc(consumed, success, vals, states, errs);
                let parser = tailRecM(initVal, func);
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
                let success = [true, true];
                let vals = ["nyan", "cat"];
                let states = [
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
                let func = generateFunc(consumed, success, vals, states, errs);
                let parser = tailRecM(initVal, func);
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
                let consumed = [false, false];
                let success = [true, false];
                let vals = ["nyan"];
                let states = [
                    new State(
                        new Config({ tabWidth: 4 }),
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
                let func = generateFunc(consumed, success, vals, states, errs);
                let parser = tailRecM(initVal, func);
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
                let success = [false];
                let vals = [];
                let states = [];
                let errs = [
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
                    )
                ];
                let func = generateFunc(consumed, success, vals, states, errs);
                let parser = tailRecM(initVal, func);
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
        }
    });

    it("should return the same result as the parser that calls `bind' recursively", () => {
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        let initVal = "nyan";
        function generateParsers(consumed, success, vals, states, errs) {
            let i = 0;
            let len = consumed.length;
            return {
                tailRecM: tailRecM(initVal, val => {
                    expect(val).to.equal(i === 0 ? initVal : vals[i - 1]);
                    return new Parser(state => {
                        expect(State.equal(state, i === 0 ? initState : states[i - 1]));
                        let _consumed = consumed[i];
                        let _success  = success[i];
                        let _val      = { done: i === len - 1, value: vals[i] };
                        let _state    = states[i];
                        let _err      = errs[i];
                        i += 1;
                        return new Result(_consumed, _success, _err, _val, _state);
                    });
                }),
                bind: consumed.reduce(
                    (acc, _, i) => bind(acc, val => {
                        expect(val).to.equal(i === 0 ? initVal : vals[i - 1]);
                        return new Parser(state => {
                            expect(State.equal(state, i === 0 ? initState : states[i - 1]));
                            let _consumed = consumed[i];
                            let _success  = success[i];
                            let _val      = vals[i];
                            let _state    = states[i];
                            let _err      = errs[i];
                            i += 1;
                            return new Result(_consumed, _success, _err, _val, _state);
                        });
                    }),
                    pure(initVal)
                )
            };
        }
        let vals = ["c", "a", "t"];
        let states = [
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
            ),
            new State(
                new Config({ tabWidth: 4 }),
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
            )
        ];
        let tf = [true, false];
        let consumed = [];
        let success = [];
        for (let b1 of tf) {
            for (let b2 of tf) {
                for (let b3 of tf) {
                    consumed.push([b1, b2, b3]);
                    success.push([b1, b2, b3]);
                }
            }
        }
        for (let c of consumed) {
            for (let s of success) {
                let ps = generateParsers(c, s, vals, states, errs);
                expect(Result.equal(
                    ps.tailRecM.run(initState),
                    ps.bind.run(initState)
                )).to.be.true;
            }
        }
    });

    it("should be stack-safe", () => {
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        let i = 0;
        let func = () => {
            let done = i >= 20000;
            i += 1;
            return pure({ done: done, value: undefined });
        };
        let parser = tailRecM(undefined, func);
        expect(() => { parser.run(initState); }).not.to.throw(RangeError, /stack/);
    });
});

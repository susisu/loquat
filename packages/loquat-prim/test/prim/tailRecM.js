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
            return val => {
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
            };
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
                const func = val => {
                    expect(val).to.equal("nyan");
                    return new Parser(state => {
                        expect(State.equal(state, initState));
                        return Result.csuc(err, { done: true, value: "cat" }, finalState);
                    });
                };
                const parser = tailRecM("nyan", func);
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
                const func = val => {
                    expect(val).to.equal("nyan");
                    return new Parser(state => {
                        expect(State.equal(state, initState));
                        return Result.cerr(err);
                    });
                };
                const parser = tailRecM("nyan", func);
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
                const func = val => {
                    expect(val).to.equal("nyan");
                    return new Parser(state => {
                        expect(State.equal(state, initState));
                        return Result.esuc(err, { done: true, value: "cat" }, finalState);
                    });
                };
                const parser = tailRecM("nyan", func);
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
                const func = val => {
                    expect(val).to.equal("nyan");
                    return new Parser(state => {
                        expect(State.equal(state, initState));
                        return Result.eerr(err);
                    });
                };
                const parser = tailRecM("nyan", func);
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
                const parser = tailRecM(initVal, func);
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
                const parser = tailRecM(initVal, func);
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
                const parser = tailRecM(initVal, func);
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
                const parser = tailRecM(initVal, func);
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
                const parser = tailRecM(initVal, func);
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
                const parser = tailRecM(initVal, func);
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
                const parser = tailRecM(initVal, func);
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
                const parser = tailRecM(initVal, func);
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
                const parser = tailRecM(initVal, func);
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
                const parser = tailRecM(initVal, func);
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

    it("should return the same result as the parser that calls `bind' recursively", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        const initVal = "nyan";
        function generateParsers(consumed, success, vals, states, errs) {
            let i = 0;
            const len = consumed.length;
            return {
                tailRecM: tailRecM(initVal, val => {
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
                }),
                bind: consumed.reduce(
                    (acc, _, i) => bind(acc, val => {
                        expect(val).to.equal(i === 0 ? initVal : vals[i - 1]);
                        return new Parser(state => {
                            expect(State.equal(state, i === 0 ? initState : states[i - 1]));
                            const _consumed = consumed[i];
                            const _success  = success[i];
                            const _val      = vals[i];
                            const _state    = states[i];
                            const _err      = errs[i];
                            i += 1;
                            return new Result(_consumed, _success, _err, _val, _state);
                        });
                    }),
                    pure(initVal)
                )
            };
        }
        const vals = ["c", "a", "t"];
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
            ),
            new State(
                new Config({ tabWidth: 4 }),
                "restC",
                new SourcePos("foobar", 1, 1),
                "someC"
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
            )
        ];
        const tf = [true, false];
        const consumed = [];
        const success = [];
        for (const b1 of tf) {
            for (const b2 of tf) {
                for (const b3 of tf) {
                    consumed.push([b1, b2, b3]);
                    success.push([b1, b2, b3]);
                }
            }
        }
        for (const c of consumed) {
            for (const s of success) {
                const ps = generateParsers(c, s, vals, states, errs);
                expect(Result.equal(
                    ps.tailRecM.run(initState),
                    ps.bind.run(initState)
                )).to.be.true;
            }
        }
    });

    it("should be stack-safe", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        let i = 0;
        const func = () => {
            const done = i >= 20000;
            i += 1;
            return pure({ done: done, value: undefined });
        };
        const parser = tailRecM(undefined, func);
        expect(() => { parser.run(initState); }).not.to.throw(RangeError, /stack/);
    });
});

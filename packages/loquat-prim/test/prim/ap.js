/*
 * loquat-prim test / prim.ap()
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
const pure = _prim.pure;
const ap   = _prim.ap;

describe(".ap(parserA, parserB)", () => {
    it("should return a parser that runs `parserA' and `parserB', "
        + "then applies the former resultant value (function) to the latter one", () => {
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        let stateA = new State(
            new Config({ tabWidth: 4 }),
            "restA",
            new SourcePos("foobar", 1, 2),
            "someA"
        );
        let errA = new ParseError(
            new SourcePos("foobar", 1, 2),
            [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
        );
        let stateB = new State(
            new Config({ tabWidth: 2 }),
            "restB",
            new SourcePos("foobar", 1, 2),
            "someB"
        );
        let errB = new ParseError(
            new SourcePos("foobar", 1, 2),
            [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
        );
        // csuc, csuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(
                    errA,
                    x => {
                        expect(x).to.equal("nyan");
                        return "cat";
                    },
                    stateA
                );
            });
            let parserB = new Parser(state => {
                expect(state).to.equal(stateA);
                return Result.csuc(errB, "nyan", stateB);
            });
            let composed = ap(parserA, parserB);
            assertParser(composed);
            let res = composed.run(initState);
            expect(Result.equal(res, Result.csuc(errB, "cat", stateB))).to.be.true;
        }
        // csuc, cerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(
                    errA,
                    x => {
                        expect(x).to.equal("nyan");
                        return "cat";
                    },
                    stateA
                );
            });
            let parserB = new Parser(state => {
                expect(state).to.equal(stateA);
                return Result.cerr(errB);
            });
            let composed = ap(parserA, parserB);
            assertParser(composed);
            let res = composed.run(initState);
            expect(Result.equal(res, Result.cerr(errB))).to.be.true;
        }
        // csuc, esuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(
                    errA,
                    x => {
                        expect(x).to.equal("nyan");
                        return "cat";
                    },
                    stateA
                );
            });
            let parserB = new Parser(state => {
                expect(state).to.equal(stateA);
                return Result.esuc(errB, "nyan", stateB);
            });
            let composed = ap(parserA, parserB);
            assertParser(composed);
            let res = composed.run(initState);
            expect(Result.equal(res, Result.csuc(ParseError.merge(errA, errB), "cat", stateB))).to.be.true;
        }
        // csuc, eerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(
                    errA,
                    x => {
                        expect(x).to.equal("nyan");
                        return "cat";
                    },
                    stateA
                );
            });
            let parserB = new Parser(state => {
                expect(state).to.equal(stateA);
                return Result.eerr(errB);
            });
            let composed = ap(parserA, parserB);
            assertParser(composed);
            let res = composed.run(initState);
            expect(Result.equal(res, Result.cerr(ParseError.merge(errA, errB)))).to.be.true;
        }
        // cerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(errA);
            });
            let parserB = new Parser(() => {
                throw new Error("unexpected call");
            });
            let composed = ap(parserA, parserB);
            assertParser(composed);
            let res = composed.run(initState);
            expect(Result.equal(res, Result.cerr(errA))).to.be.true;
        }
        // esuc, csuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(
                    errA,
                    x => {
                        expect(x).to.equal("nyan");
                        return "cat";
                    },
                    stateA
                );
            });
            let parserB = new Parser(state => {
                expect(state).to.equal(stateA);
                return Result.csuc(errB, "nyan", stateB);
            });
            let composed = ap(parserA, parserB);
            assertParser(composed);
            let res = composed.run(initState);
            expect(Result.equal(res, Result.csuc(errB, "cat", stateB))).to.be.true;
        }
        // esuc, cerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(
                    errA,
                    x => {
                        expect(x).to.equal("nyan");
                        return "cat";
                    },
                    stateA
                );
            });
            let parserB = new Parser(state => {
                expect(state).to.equal(stateA);
                return Result.cerr(errB);
            });
            let composed = ap(parserA, parserB);
            assertParser(composed);
            let res = composed.run(initState);
            expect(Result.equal(res, Result.cerr(errB))).to.be.true;
        }
        // esuc, esuc
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(
                    errA,
                    x => {
                        expect(x).to.equal("nyan");
                        return "cat";
                    },
                    stateA
                );
            });
            let parserB = new Parser(state => {
                expect(state).to.equal(stateA);
                return Result.esuc(errB, "nyan", stateB);
            });
            let composed = ap(parserA, parserB);
            assertParser(composed);
            let res = composed.run(initState);
            expect(Result.equal(res, Result.esuc(ParseError.merge(errA, errB), "cat", stateB))).to.be.true;
        }
        // esuc, eerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(
                    errA,
                    x => {
                        expect(x).to.equal("nyan");
                        return "cat";
                    },
                    stateA
                );
            });
            let parserB = new Parser(state => {
                expect(state).to.equal(stateA);
                return Result.eerr(errB);
            });
            let composed = ap(parserA, parserB);
            assertParser(composed);
            let res = composed.run(initState);
            expect(Result.equal(res, Result.eerr(ParseError.merge(errA, errB)))).to.be.true;
        }
        // eerr
        {
            let parserA = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(errA);
            });
            let parserB = new Parser(() => {
                throw new Error("unexpected call");
            });
            let composed = ap(parserA, parserB);
            assertParser(composed);
            let res = composed.run(initState);
            expect(Result.equal(res, Result.eerr(errA))).to.be.true;
        }
    });

    it("should obey the applicative functor laws", () => {
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        // pure id <*> parser = parser
        {
            let id = x => x;
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
            let parsers = [
                new Parser(() => Result.csuc(err, "nyancat", finalState)),
                new Parser(() => Result.cerr(err)),
                new Parser(() => Result.esuc(err, "nyancat", finalState)),
                new Parser(() => Result.eerr(err))
            ];
            for (let parser of parsers) {
                expect(Result.equal(
                    ap(pure(id), parser).run(initState),
                    parser.run(initState)
                )).to.be.true;
            }
        }
        // pure (.) <*> u <*> v <*> w = u <*> (v <*> w)
        {
            let compose = f => g => x => f(g(x));

            let stateU = new State(
                new Config({ tabWidth: 4 }),
                "restU",
                new SourcePos("foobar", 1, 1),
                "someU"
            );
            let errU = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testU")]
            );
            let us = [
                new Parser(() => Result.csuc(errU, x => x.toUpperCase(), stateU)),
                new Parser(() => Result.cerr(errU)),
                new Parser(() => Result.esuc(errU, x => x.toUpperCase(), stateU)),
                new Parser(() => Result.eerr(errU))
            ];

            let stateV = new State(
                new Config({ tabWidth: 4 }),
                "restV",
                new SourcePos("foobar", 1, 1),
                "someV"
            );
            let errV = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testV")]
            );
            let vs = [
                new Parser(() => Result.csuc(errV, x => x + "cat", stateV)),
                new Parser(() => Result.cerr(errV)),
                new Parser(() => Result.esuc(errV, x => x + "cat", stateV)),
                new Parser(() => Result.eerr(errV))
            ];

            let stateW = new State(
                new Config({ tabWidth: 4 }),
                "restW",
                new SourcePos("foobar", 1, 1),
                "someW"
            );
            let errW = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testW")]
            );
            let ws = [
                new Parser(() => Result.csuc(errW, "nyan", stateW)),
                new Parser(() => Result.cerr(errW)),
                new Parser(() => Result.esuc(errW, "nyan", stateW)),
                new Parser(() => Result.eerr(errW))
            ];

            for (let u of us) {
                for (let v of vs) {
                    for (let w of ws) {
                        expect(Result.equal(
                            ap(ap(ap(pure(compose), u), v), w).run(initState),
                            ap(u, ap(v, w)).run(initState)
                        )).to.be.true;
                    }
                }
            }
        }
        // pure f <*> pure x = pure (f x)
        {
            let f = x => x.toUpperCase();
            let x = "nyancat";
            expect(Result.equal(
                ap(pure(f), pure(x)).run(initState),
                pure(f(x)).run(initState)
            )).to.be.true;
        }
        // parser <*> pure x = pure ($ x) <*> parser
        {
            let flipApply = x => f => f(x);

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
            let parsers = [
                new Parser(() => Result.csuc(err, x => x.toUpperCase(), finalState)),
                new Parser(() => Result.cerr(err)),
                new Parser(() => Result.esuc(err, x => x.toUpperCase(), finalState)),
                new Parser(() => Result.eerr(err))
            ];

            let x = "nyancat";

            for (let parser of parsers) {
                expect(Result.equal(
                    ap(parser, pure(x)).run(initState),
                    ap(pure(flipApply(x)), parser).run(initState)
                )).to.be.true;
            }
        }
    });
});

/*
 * loquat-prim test / prim.flatMap()
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
const __return__ = _prim.return;
const flatMap    = _prim.flatMap;

describe(".flatMap(parser, func)", () => {
    it("should return a parser that runs `parser', maps `func' to the result, and flattens its return value", () => {
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
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);
            });
            let func = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(state).to.equal(stateA);
                    return Result.csuc(errB, "cat", stateB);
                });
            };
            let mapped = flatMap(parser, func);
            assertParser(mapped);
            let res = mapped.run(initState);
            expect(Result.equal(res, Result.csuc(errB, "cat", stateB))).to.be.true;
        }
        // csuc, cerr
        {
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);
            });
            let func = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(state).to.equal(stateA);
                    return Result.cerr(errB);
                });
            };
            let mapped = flatMap(parser, func);
            assertParser(mapped);
            let res = mapped.run(initState);
            expect(Result.equal(res, Result.cerr(errB))).to.be.true;
        }
        // csuc, esuc
        {
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);
            });
            let func = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(state).to.equal(stateA);
                    return Result.esuc(errB, "cat", stateB);
                });
            };
            let mapped = flatMap(parser, func);
            assertParser(mapped);
            let res = mapped.run(initState);
            expect(Result.equal(res, Result.csuc(ParseError.merge(errA, errB), "cat", stateB))).to.be.true;
        }
        // csuc, eerr
        {
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);
            });
            let func = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(state).to.equal(stateA);
                    return Result.eerr(errB);
                });
            };
            let mapped = flatMap(parser, func);
            let res = mapped.run(initState);
            expect(Result.equal(res, Result.cerr(ParseError.merge(errA, errB)))).to.be.true;
        }
        // cerr
        {
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(errA);
            });
            let func = () => { throw new Error("unexpected call"); };
            let mapped = flatMap(parser, func);
            assertParser(mapped);
            let res = mapped.run(initState);
            expect(Result.equal(res, Result.cerr(errA))).to.be.true;
        }
        // esuc, csuc
        {
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });
            let func = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(state).to.equal(stateA);
                    return Result.csuc(errB, "cat", stateB);
                });
            };
            let mapped = flatMap(parser, func);
            assertParser(mapped);
            let res = mapped.run(initState);
            expect(Result.equal(res, Result.csuc(errB, "cat", stateB))).to.be.true;
        }
        // esuc, cerr
        {
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });
            let func = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(state).to.equal(stateA);
                    return Result.cerr(errB);
                });
            };
            let mapped = flatMap(parser, func);
            assertParser(mapped);
            let res = mapped.run(initState);
            expect(Result.equal(res, Result.cerr(errB))).to.be.true;
        }
        // esuc, esuc
        {
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });
            let func = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(state).to.equal(stateA);
                    return Result.esuc(errB, "cat", stateB);
                });
            };
            let mapped = flatMap(parser, func);
            assertParser(mapped);
            let res = mapped.run(initState);
            expect(Result.equal(res, Result.esuc(ParseError.merge(errA, errB), "cat", stateB))).to.be.true;
        }
        // esuc, eerr
        {
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });
            let func = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(state).to.equal(stateA);
                    return Result.eerr(errB);
                });
            };
            let mapped = flatMap(parser, func);
            assertParser(mapped);
            let res = mapped.run(initState);
            expect(Result.equal(res, Result.eerr(ParseError.merge(errA, errB)))).to.be.true;
        }
        // eerr
        {
            let parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(errA);
            });
            let func = () => { throw new Error("unexpected call"); };
            let mapped = flatMap(parser, func);
            assertParser(mapped);
            let res = mapped.run(initState);
            expect(Result.equal(res, Result.eerr(errA))).to.be.true;
        }
    });

    it("should obey the monad laws", () => {
        let initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        // return x >>= func = func x
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
            let funcs = [
                () => new Parser(() => Result.csuc(err, "cat", finalState)),
                () => new Parser(() => Result.cerr(err)),
                () => new Parser(() => Result.esuc(err, "cat", finalState)),
                () => new Parser(() => Result.eerr(err))
            ];
            for (let func of funcs) {
                expect(Result.equal(
                    flatMap(__return__("nyan"), func).run(initState),
                    func("nyan").run(initState)
                )).to.be.true;
            }
        }
        // parser >>= return = parser
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
            let parsers = [
                new Parser(() => Result.csuc(err, "nyancat", finalState)),
                new Parser(() => Result.cerr(err)),
                new Parser(() => Result.esuc(err, "nyancat", finalState)),
                new Parser(() => Result.eerr(err))
            ];
            for (let parser of parsers) {
                expect(Result.equal(
                    flatMap(parser, __return__).run(initState),
                    parser.run(initState)
                )).to.be.true;
            }
        }
        // (parser >>= f) >>= g = parser >>= (\x -> f x >>= g)
        {
            let stateP = new State(
                new Config({ tabWidth: 4 }),
                "restP",
                new SourcePos("foobar", 1, 1),
                "someP"
            );
            let errP = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            let parsers = [
                new Parser(() => Result.csuc(errP, "p", stateP)),
                new Parser(() => Result.cerr(errP)),
                new Parser(() => Result.esuc(errP, "p", stateP)),
                new Parser(() => Result.eerr(errP))
            ];

            let stateF = new State(
                new Config({ tabWidth: 2 }),
                "restF",
                new SourcePos("foobar", 1, 1),
                "someF"
            );
            let errF = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testF")]
            );
            let fs = [
                () => new Parser(() => Result.csuc(errF, "f", stateF)),
                () => new Parser(() => Result.cerr(errF)),
                () => new Parser(() => Result.esuc(errF, "f", stateF)),
                () => new Parser(() => Result.eerr(errF))
            ];

            let stateG = new State(
                new Config({ tabWidth: 1 }),
                "restG",
                new SourcePos("foobar", 1, 1),
                "someG"
            );
            let errG = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testG")]
            );
            let gs = [
                () => new Parser(() => Result.csuc(errG, "g", stateG)),
                () => new Parser(() => Result.cerr(errG)),
                () => new Parser(() => Result.esuc(errG, "g", stateG)),
                () => new Parser(() => Result.eerr(errG))
            ];

            for (let parser of parsers) {
                for (let f of fs) {
                    for (let g of gs) {
                        expect(Result.equal(
                            flatMap(flatMap(parser, f), g).run(initState),
                            flatMap(parser, x => flatMap(f(x), g)).run(initState)
                        )).to.be.true;
                    }
                }
            }
        }
    });
});

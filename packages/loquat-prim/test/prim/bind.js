/*
 * loquat-prim test / prim.bind()
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

const pure = _prim.pure;
const bind = _prim.bind;

describe(".bind(parser, func)", () => {
    it("should return a parser that runs `parser', maps `func' to the result, and flattens its return value", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        const stateA = new State(
            new Config({ tabWidth: 4 }),
            "restA",
            new SourcePos("foobar", 1, 2),
            "someA"
        );
        const errA = new ParseError(
            new SourcePos("foobar", 1, 2),
            [new ErrorMessage(ErrorMessageType.MESSAGE, "testA")]
        );
        const stateB = new State(
            new Config({ tabWidth: 2 }),
            "restB",
            new SourcePos("foobar", 1, 2),
            "someB"
        );
        const errB = new ParseError(
            new SourcePos("foobar", 1, 2),
            [new ErrorMessage(ErrorMessageType.MESSAGE, "testB")]
        );
        // csuc, csuc
        {
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);
            });
            const func = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(state).to.equal(stateA);
                    return Result.csuc(errB, "cat", stateB);
                });
            };
            const mapped = bind(parser, func);
            assertParser(mapped);
            const res = mapped.run(initState);
            expect(Result.equal(res, Result.csuc(errB, "cat", stateB))).to.be.true;
        }
        // csuc, cerr
        {
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);
            });
            const func = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(state).to.equal(stateA);
                    return Result.cerr(errB);
                });
            };
            const mapped = bind(parser, func);
            assertParser(mapped);
            const res = mapped.run(initState);
            expect(Result.equal(res, Result.cerr(errB))).to.be.true;
        }
        // csuc, esuc
        {
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);
            });
            const func = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(state).to.equal(stateA);
                    return Result.esuc(errB, "cat", stateB);
                });
            };
            const mapped = bind(parser, func);
            assertParser(mapped);
            const res = mapped.run(initState);
            expect(Result.equal(res, Result.csuc(ParseError.merge(errA, errB), "cat", stateB))).to.be.true;
        }
        // csuc, eerr
        {
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(errA, "nyan", stateA);
            });
            const func = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(state).to.equal(stateA);
                    return Result.eerr(errB);
                });
            };
            const mapped = bind(parser, func);
            assertParser(mapped);
            const res = mapped.run(initState);
            expect(Result.equal(res, Result.cerr(ParseError.merge(errA, errB)))).to.be.true;
        }
        // cerr
        {
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(errA);
            });
            const func = () => { throw new Error("unexpected call"); };
            const mapped = bind(parser, func);
            assertParser(mapped);
            const res = mapped.run(initState);
            expect(Result.equal(res, Result.cerr(errA))).to.be.true;
        }
        // esuc, csuc
        {
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });
            const func = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(state).to.equal(stateA);
                    return Result.csuc(errB, "cat", stateB);
                });
            };
            const mapped = bind(parser, func);
            assertParser(mapped);
            const res = mapped.run(initState);
            expect(Result.equal(res, Result.csuc(errB, "cat", stateB))).to.be.true;
        }
        // esuc, cerr
        {
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });
            const func = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(state).to.equal(stateA);
                    return Result.cerr(errB);
                });
            };
            const mapped = bind(parser, func);
            assertParser(mapped);
            const res = mapped.run(initState);
            expect(Result.equal(res, Result.cerr(errB))).to.be.true;
        }
        // esuc, esuc
        {
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });
            const func = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(state).to.equal(stateA);
                    return Result.esuc(errB, "cat", stateB);
                });
            };
            const mapped = bind(parser, func);
            assertParser(mapped);
            const res = mapped.run(initState);
            expect(Result.equal(res, Result.esuc(ParseError.merge(errA, errB), "cat", stateB))).to.be.true;
        }
        // esuc, eerr
        {
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(errA, "nyan", stateA);
            });
            const func = val => {
                expect(val).to.equal("nyan");
                return new Parser(state => {
                    expect(state).to.equal(stateA);
                    return Result.eerr(errB);
                });
            };
            const mapped = bind(parser, func);
            assertParser(mapped);
            const res = mapped.run(initState);
            expect(Result.equal(res, Result.eerr(ParseError.merge(errA, errB)))).to.be.true;
        }
        // eerr
        {
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(errA);
            });
            const func = () => { throw new Error("unexpected call"); };
            const mapped = bind(parser, func);
            assertParser(mapped);
            const res = mapped.run(initState);
            expect(Result.equal(res, Result.eerr(errA))).to.be.true;
        }
    });

    it("should obey the monad laws", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        // pure x >>= func = func x
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
            const funcs = [
                () => new Parser(() => Result.csuc(err, "cat", finalState)),
                () => new Parser(() => Result.cerr(err)),
                () => new Parser(() => Result.esuc(err, "cat", finalState)),
                () => new Parser(() => Result.eerr(err))
            ];
            for (const func of funcs) {
                expect(Result.equal(
                    bind(pure("nyan"), func).run(initState),
                    func("nyan").run(initState)
                )).to.be.true;
            }
        }
        // parser >>= pure = parser
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
            const parsers = [
                new Parser(() => Result.csuc(err, "nyancat", finalState)),
                new Parser(() => Result.cerr(err)),
                new Parser(() => Result.esuc(err, "nyancat", finalState)),
                new Parser(() => Result.eerr(err))
            ];
            for (const parser of parsers) {
                expect(Result.equal(
                    bind(parser, pure).run(initState),
                    parser.run(initState)
                )).to.be.true;
            }
        }
        // (parser >>= f) >>= g = parser >>= (\x -> f x >>= g)
        {
            const stateP = new State(
                new Config({ tabWidth: 4 }),
                "restP",
                new SourcePos("foobar", 1, 1),
                "someP"
            );
            const errP = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testP")]
            );
            const parsers = [
                new Parser(() => Result.csuc(errP, "p", stateP)),
                new Parser(() => Result.cerr(errP)),
                new Parser(() => Result.esuc(errP, "p", stateP)),
                new Parser(() => Result.eerr(errP))
            ];

            const stateF = new State(
                new Config({ tabWidth: 2 }),
                "restF",
                new SourcePos("foobar", 1, 1),
                "someF"
            );
            const errF = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testF")]
            );
            const fs = [
                () => new Parser(() => Result.csuc(errF, "f", stateF)),
                () => new Parser(() => Result.cerr(errF)),
                () => new Parser(() => Result.esuc(errF, "f", stateF)),
                () => new Parser(() => Result.eerr(errF))
            ];

            const stateG = new State(
                new Config({ tabWidth: 1 }),
                "restG",
                new SourcePos("foobar", 1, 1),
                "someG"
            );
            const errG = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "testG")]
            );
            const gs = [
                () => new Parser(() => Result.csuc(errG, "g", stateG)),
                () => new Parser(() => Result.cerr(errG)),
                () => new Parser(() => Result.esuc(errG, "g", stateG)),
                () => new Parser(() => Result.eerr(errG))
            ];

            for (const parser of parsers) {
                for (const f of fs) {
                    for (const g of gs) {
                        expect(Result.equal(
                            bind(bind(parser, f), g).run(initState),
                            bind(parser, x => bind(f(x), g)).run(initState)
                        )).to.be.true;
                    }
                }
            }
        }
    });
});

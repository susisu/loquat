/*
 * loquat-prim test / prim.tokenPrim()
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
const assertParser     = _core.assertParser;

const tokenPrim = _prim.tokenPrim;

describe(".tokenPrim(calcValue, tokenToString, calcNextPos, calcNextUserState = x => x)", () => {
    it("should return a parser that parses a token", () => {
        // calcValue succeeds
        {
            const initState = new State(
                new Config({ tabWidth: 8, unicode: false }),
                "ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = tokenPrim(
                (x, config) => {
                    expect(x).to.equal("A");
                    expect(Config.equal(config, new Config({ tabWidth: 8, unicode: false }))).to.be.true;
                    return { empty: false, value: "nyancat" };
                },
                () => { throw new Error("unexpected call"); },
                (pos, x, xs, config) => {
                    expect(SourcePos.equal(pos, new SourcePos("foobar", 1, 1))).to.be.true;
                    expect(x).to.equal("A");
                    expect(xs).to.equal("BC");
                    expect(Config.equal(config, new Config({ tabWidth: 8, unicode: false }))).to.be.true;
                    return new SourcePos("foobar", 1, 2);
                },
                (userState, pos, x, xs, config) => {
                    expect(userState).to.equal("none");
                    expect(SourcePos.equal(pos, new SourcePos("foobar", 1, 1))).to.be.true;
                    expect(x).to.equal("A");
                    expect(xs).to.equal("BC");
                    expect(Config.equal(config, new Config({ tabWidth: 8, unicode: false }))).to.be.true;
                    return "some";
                }
            );
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 2)),
                    "nyancat",
                    new State(
                        initState.config,
                        "BC",
                        new SourcePos("foobar", 1, 2),
                        "some"
                    )
                )
            )).to.be.true;
        }
        // calcValue succeeds, use default argument for calcNextUserState
        {
            const initState = new State(
                new Config({ tabWidth: 8, unicode: false }),
                "ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = tokenPrim(
                (x, config) => {
                    expect(x).to.equal("A");
                    expect(Config.equal(config, new Config({ tabWidth: 8, unicode: false }))).to.be.true;
                    return { empty: false, value: "nyancat" };
                },
                () => { throw new Error("unexpected call"); },
                (pos, x, xs, config) => {
                    expect(SourcePos.equal(pos, new SourcePos("foobar", 1, 1))).to.be.true;
                    expect(x).to.equal("A");
                    expect(xs).to.equal("BC");
                    expect(Config.equal(config, new Config({ tabWidth: 8, unicode: false }))).to.be.true;
                    return new SourcePos("foobar", 1, 2);
                }
            );
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 2)),
                    "nyancat",
                    new State(
                        initState.config,
                        "BC",
                        new SourcePos("foobar", 1, 2),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // calcValue fails
        {
            const initState = new State(
                new Config({ tabWidth: 8, unicode: false }),
                "ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = tokenPrim(
                (x, config) => {
                    expect(x).to.equal("A");
                    expect(Config.equal(config, new Config({ tabWidth: 8, unicode: false }))).to.be.true;
                    return { empty: true };
                },
                x => {
                    expect(x).to.equal("A");
                    return "nyancat";
                },
                () => { throw new Error("unexpected call"); },
                () => { throw new Error("unexpected call"); }
            );
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "nyancat")]
                    )
                )
            )).to.be.true;
        }
        // empty input
        {
            const initState = new State(
                new Config({ tabWidth: 8, unicode: false }),
                "",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = tokenPrim(
                () => { throw new Error("unexpected call"); },
                () => { throw new Error("unexpected call"); },
                () => { throw new Error("unexpected call"); },
                () => { throw new Error("unexpected call"); }
            );
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "")]
                    )
                )
            )).to.be.true;
        }
    });

    it("should treat input in unicode mode if `unicode' flag of the config is `true'", () => {
        // non-unicode mode
        {
            const initState = new State(
                new Config({ tabWidth: 8, unicode: false }),
                "\uD83C\uDF63ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = tokenPrim(
                (x, config) => {
                    expect(x).to.equal("\uD83C");
                    expect(Config.equal(config, new Config({ tabWidth: 8, unicode: false }))).to.be.true;
                    return { empty: false, value: "nyancat" };
                },
                () => { throw new Error("unexpected call"); },
                (pos, x, xs, config) => {
                    expect(SourcePos.equal(pos, new SourcePos("foobar", 1, 1))).to.be.true;
                    expect(x).to.equal("\uD83C");
                    expect(xs).to.equal("\uDF63ABC");
                    expect(Config.equal(config, new Config({ tabWidth: 8, unicode: false }))).to.be.true;
                    return new SourcePos("foobar", 1, 2);
                },
                (userState, pos, x, xs, config) => {
                    expect(userState).to.equal("none");
                    expect(SourcePos.equal(pos, new SourcePos("foobar", 1, 1))).to.be.true;
                    expect(x).to.equal("\uD83C");
                    expect(xs).to.equal("\uDF63ABC");
                    expect(Config.equal(config, new Config({ tabWidth: 8, unicode: false }))).to.be.true;
                    return "some";
                }
            );
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 2)),
                    "nyancat",
                    new State(
                        initState.config,
                        "\uDF63ABC",
                        new SourcePos("foobar", 1, 2),
                        "some"
                    )
                )
            )).to.be.true;
        }
        // unicode mode
        {
            const initState = new State(
                new Config({ tabWidth: 8, unicode: true }),
                "\uD83C\uDF63ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = tokenPrim(
                (x, config) => {
                    expect(x).to.equal("\uD83C\uDF63");
                    expect(Config.equal(config, new Config({ tabWidth: 8, unicode: true }))).to.be.true;
                    return { empty: false, value: "nyancat" };
                },
                () => { throw new Error("unexpected call"); },
                (pos, x, xs, config) => {
                    expect(SourcePos.equal(pos, new SourcePos("foobar", 1, 1))).to.be.true;
                    expect(x).to.equal("\uD83C\uDF63");
                    expect(xs).to.equal("ABC");
                    expect(Config.equal(config, new Config({ tabWidth: 8, unicode: true }))).to.be.true;
                    return new SourcePos("foobar", 1, 2);
                },
                (userState, pos, x, xs, config) => {
                    expect(userState).to.equal("none");
                    expect(SourcePos.equal(pos, new SourcePos("foobar", 1, 1))).to.be.true;
                    expect(x).to.equal("\uD83C\uDF63");
                    expect(xs).to.equal("ABC");
                    expect(Config.equal(config, new Config({ tabWidth: 8, unicode: true }))).to.be.true;
                    return "some";
                }
            );
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 2)),
                    "nyancat",
                    new State(
                        initState.config,
                        "ABC",
                        new SourcePos("foobar", 1, 2),
                        "some"
                    )
                )
            )).to.be.true;
        }
    });
});

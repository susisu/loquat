/*
 * loquat-prim test / prim.token()
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

const token = _prim.token;

describe(".token(calcValue, tokenToString, calcPos)", () => {
    it("should return a parser that parses a token", () => {
        // calcValue succeeds, abundant input
        {
            const initState = new State(
                new Config({ tabWidth: 8, unicode: false }),
                "ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = token(
                (x, config) => {
                    expect(x).to.equal("A");
                    expect(Config.equal(config, new Config({ tabWidth: 8, unicode: false }))).to.be.true;
                    return { empty: false, value: "nyancat" };
                },
                () => { throw new Error("unexpected call"); },
                (x, config) => {
                    expect(x).to.equal("B");
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
        // calcValue succeeds, minimal input
        {
            const initState = new State(
                new Config({ tabWidth: 8, unicode: false }),
                "A",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = token(
                (x, config) => {
                    expect(x).to.equal("A");
                    expect(Config.equal(config, new Config({ tabWidth: 8, unicode: false }))).to.be.true;
                    return { empty: false, value: "nyancat" };
                },
                () => { throw new Error("unexpected call"); },
                (x, config) => {
                    expect(x).to.equal("A");
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
                        "",
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
            const parser = token(
                (x, config) => {
                    expect(x).to.equal("A");
                    expect(Config.equal(config, new Config({ tabWidth: 8, unicode: false }))).to.be.true;
                    return { empty: true };
                },
                x => {
                    expect(x).to.equal("A");
                    return "nyancat";
                },
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
            const parser = token(
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
                "\uD83C\uDF63\uD83C\uDF64ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = token(
                (x, config) => {
                    expect(x).to.equal("\uD83C");
                    expect(Config.equal(config, new Config({ tabWidth: 8, unicode: false }))).to.be.true;
                    return { empty: false, value: "nyancat" };
                },
                () => { throw new Error("unexpected call"); },
                (x, config) => {
                    expect(x).to.equal("\uDF63");
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
                        "\uDF63\uD83C\uDF64ABC",
                        new SourcePos("foobar", 1, 2),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // unicode mode
        {
            const initState = new State(
                new Config({ tabWidth: 8, unicode: true }),
                "\uD83C\uDF63\uD83C\uDF64ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = token(
                (x, config) => {
                    expect(x).to.equal("\uD83C\uDF63");
                    expect(Config.equal(config, new Config({ tabWidth: 8, unicode: true }))).to.be.true;
                    return { empty: false, value: "nyancat" };
                },
                () => { throw new Error("unexpected call"); },
                (x, config) => {
                    expect(x).to.equal("\uD83C\uDF64");
                    expect(Config.equal(config, new Config({ tabWidth: 8, unicode: true }))).to.be.true;
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
                        "\uD83C\uDF64ABC",
                        new SourcePos("foobar", 1, 2),
                        "none"
                    )
                )
            )).to.be.true;
        }
    });
});

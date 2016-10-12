/*
 * loquat-prim test / prim.tokens()
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
const assertParser     = _core.assertParser;

const tokens = _prim.tokens;

describe(".tokens(expectTokens, tokenEqual, tokensToString, calcNextPos)", () => {
    it("should return a parser that parses tokens given by `expectTokens'", () => {
        let arrayEqual = (xs, ys) => xs.length === ys.length && xs.every((x, i) => x === ys[i]);

        let initConfig = new Config({ tabWidth: 8, unicode: false });
        let initPos    = new SourcePos("foobar", 1, 1);
        function generateParser(expectTokens) {
            return tokens(
                expectTokens,
                (x, y) => x === y,
                tokens => tokens.join(""),
                (pos, tokens, config) => {
                    expect(SourcePos.equal(pos, initPos)).to.be.true;
                    expect(tokens).to.deep.equal(expectTokens);
                    expect(Config.equal(config, initConfig)).to.be.true;
                    return new SourcePos("foobar", 1, 3);
                }
            );
        }

        // expect empty
        {
            let initState = new State(
                initConfig,
                "ABC",
                initPos,
                "none"
            );
            let expectTokens = [];
            let parser = generateParser(expectTokens);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    ParseError.unknown(initPos),
                    [],
                    initState
                ),
                arrayEqual
            )).to.be.true;
        }
        // expect many, correct input
        {
            let initState = new State(
                initConfig,
                "ABC",
                initPos,
                "none"
            );
            let expectTokens = ["A", "B"];
            let parser = generateParser(expectTokens);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 3)),
                    ["A", "B"],
                    new State(
                        initState.config,
                        "C",
                        new SourcePos("foobar", 1, 3),
                        "none"
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
        // expect many, totally wrong input
        {
            let initState = new State(
                initConfig,
                "CDE",
                initPos,
                "none"
            );
            let expectTokens = ["A", "B"];
            let parser = generateParser(expectTokens);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        initPos,
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "C"),
                            new ErrorMessage(ErrorMessageType.EXPECT, "AB")
                        ]
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
        // expect many, partially wrong input
        {
            let initState = new State(
                initConfig,
                "ACD",
                initPos,
                "none"
            );
            let expectTokens = ["A", "B"];
            let parser = generateParser(expectTokens);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        initPos,
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "C"),
                            new ErrorMessage(ErrorMessageType.EXPECT, "AB")
                        ]
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
        // expect many, no input
        {
            let initState = new State(
                initConfig,
                "",
                initPos,
                "none"
            );
            let expectTokens = ["A", "B"];
            let parser = generateParser(expectTokens);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        initPos,
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                            new ErrorMessage(ErrorMessageType.EXPECT, "AB")
                        ]
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
        // expect many, less input
        {
            let initState = new State(
                initConfig,
                "A",
                initPos,
                "none"
            );
            let expectTokens = ["A", "B"];
            let parser = generateParser(expectTokens);
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        initPos,
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                            new ErrorMessage(ErrorMessageType.EXPECT, "AB")
                        ]
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
    });

    it("should treat input in unicode mode if `unicode' flag of the config is `true'", () => {
        let arrayEqual = (xs, ys) => xs.length === ys.length && xs.every((x, i) => x === ys[i]);

        // non-unicode mode
        {
            let initState = new State(
                new Config({ tabWidth: 8, unicode: false }),
                "\uD83C\uDF63ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let expectTokens = ["\uD83C\uDF63", "A"];
            let parser = tokens(
                expectTokens,
                (x, y) => x === y,
                tokens => tokens.join(""),
                (pos, tokens, config) => {
                    expect(SourcePos.equal(pos, initState.pos)).to.be.true;
                    expect(tokens).to.deep.equal(expectTokens);
                    expect(Config.equal(config, initState.config)).to.be.true;
                    return new SourcePos("foobar", 1, 3);
                }
            );
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "\uD83C"),
                            new ErrorMessage(ErrorMessageType.EXPECT, "\uD83C\uDF63A")
                        ]
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
        // unicode mode
        {
            let initState = new State(
                new Config({ tabWidth: 8, unicode: true }),
                "\uD83C\uDF63ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let expectTokens = ["\uD83C\uDF63", "A"];
            let parser = tokens(
                expectTokens,
                (x, y) => x === y,
                tokens => tokens.join(""),
                (pos, tokens, config) => {
                    expect(SourcePos.equal(pos, initState.pos)).to.be.true;
                    expect(tokens).to.deep.equal(expectTokens);
                    expect(Config.equal(config, initState.config)).to.be.true;
                    return new SourcePos("foobar", 1, 3);
                }
            );
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 3)),
                    ["\uD83C\uDF63", "A"],
                    new State(
                        initState.config,
                        "BC",
                        new SourcePos("foobar", 1, 3),
                        "none"
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
    });
});

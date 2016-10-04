/*
 * loquat-prim test / prim.tokens()
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
const assertParser     = _core.assertParser;

const _prim = require("prim.js")(_core);
const tokens = _prim.tokens;

describe(".tokens(expectTokens, tokenEqual, tokensToString, calcNextPos)", () => {
    it("should return a parser that parses tokens given by `expectTokens'", () => {
        let arrayEqual = (xs, ys) => xs.length === ys.length && xs.every((x, i) => x === ys[i]);

        let initPos = new SourcePos("foobar", 1, 1);
        function generateParser(expectTokens) {
            return tokens(
                expectTokens,
                (x, y) => x === y,
                tokens => tokens.join(""),
                (pos, tokens) => {
                    expect(SourcePos.equal(pos, initPos)).to.be.true;
                    expect(tokens).to.deep.equal(expectTokens);
                    return new SourcePos("foobar", 1, 3);
                }
            );
        }

        // expect empty
        {
            let initState = new State(
                new Config({ tabWidth: 8 }),
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
                new Config({ tabWidth: 8 }),
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
                new Config({ tabWidth: 8 }),
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
                new Config({ tabWidth: 8 }),
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
                new Config({ tabWidth: 8 }),
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
                new Config({ tabWidth: 8 }),
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
});

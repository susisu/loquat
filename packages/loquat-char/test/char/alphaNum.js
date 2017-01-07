/*
 * loquat-char test / char.alphaNum
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const show             = _core.show;
const SourcePos        = _core.SourcePos;
const ErrorMessageType = _core.ErrorMessageType;
const ErrorMessage     = _core.ErrorMessage;
const ParseError       = _core.ParseError;
const Config           = _core.Config;
const State            = _core.State;
const Result           = _core.Result;
const assertParser     = _core.assertParser;

const alphaNum = _char.alphaNum;

describe(".alphaNum", () => {
    it("should return a parser that parses a letter or digit", () => {
        assertParser(alphaNum);
        // match
        for (const c of "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz") {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                c + "+-*",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = alphaNum.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 2)),
                    c,
                    new State(
                        initState.config,
                        "+-*",
                        new SourcePos("foobar", 1, 2),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // not match
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "+-*",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = alphaNum.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("+")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "letter or digit")
                        ]
                    )
                )
            )).to.be.true;
        }
        // empty input
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = alphaNum.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                            new ErrorMessage(ErrorMessageType.EXPECT, "letter or digit")
                        ]
                    )
                )
            )).to.be.true;
        }
    });
});

/*
 * loquat-char test / char.hexDigit
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

const hexDigit = _char.hexDigit;

describe(".hexDigit", () => {
    it("should return a parser that parses a hexadecimal digit", () => {
        assertParser(hexDigit);
        // match
        for (const c of "0123456789ABCDEFabcdef") {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                c + "GHI",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = hexDigit.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 2)),
                    c,
                    new State(
                        initState.config,
                        "GHI",
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
                "GHI",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = hexDigit.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("G")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "hexadecimal digit")
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
            const res = hexDigit.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                            new ErrorMessage(ErrorMessageType.EXPECT, "hexadecimal digit")
                        ]
                    )
                )
            )).to.be.true;
        }
    });
});

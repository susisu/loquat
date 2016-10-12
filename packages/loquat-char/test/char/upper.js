/*
 * loquat-char test / char.upper
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

const upper = _char.upper;

describe(".upper", () => {
    it("should return a parser that parses a uppercase letter", () => {
        assertParser(upper);
        // match
        for (let c of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
            let initState = new State(
                new Config({ tabWidth: 8 }),
                c + "abc",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let res = upper.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 2)),
                    c,
                    new State(
                        initState.config,
                        "abc",
                        new SourcePos("foobar", 1, 2),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // not match
        {
            let initState = new State(
                new Config({ tabWidth: 8 }),
                "abc",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let res = upper.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("a")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "uppercase letter")
                        ]
                    )
                )
            )).to.be.true;
        }
        // empty input
        {
            let initState = new State(
                new Config({ tabWidth: 8 }),
                "",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let res = upper.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                            new ErrorMessage(ErrorMessageType.EXPECT, "uppercase letter")
                        ]
                    )
                )
            )).to.be.true;
        }
    });
});

/*
 * loquat-char test / char.newline
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

const newline = _char.newline;

describe(".newline", () => {
    it("should return a parser that parses a newline character (LF)", () => {
        assertParser(newline);
        // match
        {
            let initState = new State(
                new Config({ tabWidth: 8 }),
                "\nABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let res = newline.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 2, 1)),
                    "\n",
                    new State(
                        initState.config,
                        "ABC",
                        new SourcePos("foobar", 2, 1),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // not match
        {
            let initState = new State(
                new Config({ tabWidth: 8 }),
                "ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let res = newline.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "new-line")
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
            let res = newline.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                            new ErrorMessage(ErrorMessageType.EXPECT, "new-line")
                        ]
                    )
                )
            )).to.be.true;
        }
    });
});

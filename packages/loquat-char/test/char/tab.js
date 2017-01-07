/*
 * loquat-char test / char.tab
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

const tab = _char.tab;

describe(".tab", () => {
    it("should return a parser that parses a tab character", () => {
        assertParser(tab);
        // match
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "\tABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = tab.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 9)),
                    "\t",
                    new State(
                        initState.config,
                        "ABC",
                        new SourcePos("foobar", 1, 9),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // not match
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = tab.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "tab")
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
            const res = tab.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                            new ErrorMessage(ErrorMessageType.EXPECT, "tab")
                        ]
                    )
                )
            )).to.be.true;
        }
    });
});

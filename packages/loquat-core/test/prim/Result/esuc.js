/*
 * loquat-core test / prim.Result.esuc()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("pos.js");
const { ErrorMessageType, ErrorMessage, ParseError } = require("error.js");
const { Config, State, Result } = require("prim.js");

describe(".esuc(err, val, state)", () => {
    it("should create a not consumed and succeeded result object", () => {
        let res = Result.esuc(
            new ParseError(
                new SourcePos("foobar", 6, 6),
                [
                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "x"),
                    new ErrorMessage(ErrorMessageType.UNEXPECT, "y"),
                    new ErrorMessage(ErrorMessageType.EXPECT, "z"),
                    new ErrorMessage(ErrorMessageType.MESSAGE, "w")
                ]
            ),
            "result",
            new State(
                new Config({ tabWidth: 4, useCodePoint: true }),
                "rest",
                new SourcePos("foobar", 496, 28),
                "none"
            )
        );
        expect(Result.equal(
            res,
            new Result(
                false,
                true,
                new ParseError(
                    new SourcePos("foobar", 6, 6),
                    [
                        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "x"),
                        new ErrorMessage(ErrorMessageType.UNEXPECT, "y"),
                        new ErrorMessage(ErrorMessageType.EXPECT, "z"),
                        new ErrorMessage(ErrorMessageType.MESSAGE, "w")
                    ]
                ),
                "result",
                new State(
                    new Config({ tabWidth: 4, useCodePoint: true }),
                    "rest",
                    new SourcePos("foobar", 496, 28),
                    "none"
                )
            )
        )).to.be.true;
    });
});

/*
 * loquat-core test / parser.Result.esuc()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos = _pos.SourcePos;

const ErrorMessageType = _error.ErrorMessageType;
const ErrorMessage     = _error.ErrorMessage;
const ParseError       = _error.ParseError;

const Config = _parser.Config;
const State  = _parser.State;
const Result = _parser.Result;

describe(".esuc(err, val, state)", () => {
    it("should create an empty success result object", () => {
        const res = Result.esuc(
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
                new Config({ tabWidth: 4, unicode: true }),
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
                    new Config({ tabWidth: 4, unicode: true }),
                    "rest",
                    new SourcePos("foobar", 496, 28),
                    "none"
                )
            )
        )).to.be.true;
    });
});

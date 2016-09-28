/*
 * loquat-core test / parser.Result.eerr()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("pos.js");
const { ErrorMessageType, ErrorMessage, ParseError } = require("error.js");
const { Result } = require("parser.js");

describe(".eerr(err)", () => {
    it("should create a not consumed but failed result object", () => {
        let res = Result.eerr(
            new ParseError(
                new SourcePos("foobar", 6, 6),
                [
                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "x"),
                    new ErrorMessage(ErrorMessageType.UNEXPECT, "y"),
                    new ErrorMessage(ErrorMessageType.EXPECT, "z"),
                    new ErrorMessage(ErrorMessageType.MESSAGE, "w")
                ]
            )
        );
        expect(Result.equal(
            res,
            new Result(
                false,
                false,
                new ParseError(
                    new SourcePos("foobar", 6, 6),
                    [
                        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "x"),
                        new ErrorMessage(ErrorMessageType.UNEXPECT, "y"),
                        new ErrorMessage(ErrorMessageType.EXPECT, "z"),
                        new ErrorMessage(ErrorMessageType.MESSAGE, "w")
                    ]
                )
            )
        )).to.be.true;
    });
});

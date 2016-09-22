/*
 * loquat test / parser.Result constructor()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("pos.js");
const { ErrorMessageType, ErrorMessage, ParseError } = require("error.js");
const { Config, State, Result } = require("parser.js");

describe("constructor(consumed, succeeded, err, val, state)", () => {
    it("should create a new `Result' instance", () => {
        {
            let res = new Result(
                true,
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
            );
            expect(res).to.be.an.instanceOf(Result);
            expect(res.consumed).to.be.true;
            expect(res.succeeded).to.be.true,
            expect(ParseError.equal(
                res.err,
                new ParseError(
                    new SourcePos("foobar", 6, 6),
                    [
                        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "x"),
                        new ErrorMessage(ErrorMessageType.UNEXPECT, "y"),
                        new ErrorMessage(ErrorMessageType.EXPECT, "z"),
                        new ErrorMessage(ErrorMessageType.MESSAGE, "w")
                    ]
                )
            )).to.be.true;
            expect(res.val).to.equal("result");
            expect(State.equal(
                res.state,
                new State(
                    new Config({ tabWidth: 4, useCodePoint: true }),
                    "rest",
                    new SourcePos("foobar", 496, 28),
                    "none"
                )
            )).to.be.true;
        }
        // use default arguments
        {
            let res = new Result(
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
            );
            expect(res).to.be.an.instanceOf(Result);
            expect(res.consumed).to.be.false;
            expect(res.succeeded).to.be.false;
            expect(ParseError.equal(
                res.err,
                new ParseError(
                    new SourcePos("foobar", 6, 6),
                    [
                        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "x"),
                        new ErrorMessage(ErrorMessageType.UNEXPECT, "y"),
                        new ErrorMessage(ErrorMessageType.EXPECT, "z"),
                        new ErrorMessage(ErrorMessageType.MESSAGE, "w")
                    ]
                )
            )).to.be.true;
            expect(res.val).to.be.undefined;
            expect(res.state).to.be.undefiend;
        }
    });
});

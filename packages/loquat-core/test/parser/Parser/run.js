/*
 * loquat test / parser.Parser#run()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { SourcePos } = require("pos.js");
const { ErrorMessageType, ErrorMessage, ParseError } = require("error.js");
const { Config, State, Result, Parser } = require("parser.js");

describe("#run(state)", () => {
    it("should call the parser function with `state' and return the result", () => {
        let flag = false;
        let parser = new Parser(state => {
            flag = true;
            expect(State.equal(
                state,
                new State(
                    new Config({ tabWidth: 4, useCodePoint: true }),
                    "init",
                    new SourcePos("foobar", 496, 28),
                    "none"
                )
            )).to.be.true;
            return new Result(
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
                    "some"
                )
            );
        });
        let res = parser.run(new State(
            new Config({ tabWidth: 4, useCodePoint: true }),
            "init",
            new SourcePos("foobar", 496, 28),
            "none"
        ));
        expect(flag).to.be.true;
        expect(Result.equal(
            res,
            new Result(
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
                    "some"
                )
            )
        )).to.be.true;
    });
});

/*
 * loquat-core test / parser.Parser#run()
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
const Parser = _parser.Parser;

describe("#run(state)", () => {
    it("should call the parser function with `state' and return the result", () => {
        let flag = false;
        const parser = new Parser(state => {
            flag = true;
            expect(State.equal(
                state,
                new State(
                    new Config({ tabWidth: 4, unicode: true }),
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
                    new Config({ tabWidth: 4, unicode: true }),
                    "rest",
                    new SourcePos("foobar", 496, 28),
                    "some"
                )
            );
        });
        const res = parser.run(new State(
            new Config({ tabWidth: 4, unicode: true }),
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
                    new Config({ tabWidth: 4, unicode: true }),
                    "rest",
                    new SourcePos("foobar", 496, 28),
                    "some"
                )
            )
        )).to.be.true;
    });
});

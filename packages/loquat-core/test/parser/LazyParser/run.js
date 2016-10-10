/*
 * loquat-core test / parser.LazyParser#run()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const _pos = require("pos.js");
const SourcePos = _pos.SourcePos;

const _error = require("error.js");
const ErrorMessageType = _error.ErrorMessageType;
const ErrorMessage     = _error.ErrorMessage;
const ParseError       = _error.ParseError;

const _parser = require("parser.js");
const Config     = _parser.Config;
const State      = _parser.State;
const Result     = _parser.Result;
const Parser     = _parser.Parser;
const LazyParser = _parser.LazyParser;

describe("#run(state)", () => {
    it("should evluate the thunk and call `#run()' method of the resultant parser object with `state'", () => {
        let flag = false;
        let evaluated = false;
        let parser = new LazyParser(() => {
            evaluated = true;
            return new Parser(state => {
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
        });
        let res = parser.run(new State(
            new Config({ tabWidth: 4, unicode: true }),
            "init",
            new SourcePos("foobar", 496, 28),
            "none"
        ));
        expect(evaluated).to.be.true;
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

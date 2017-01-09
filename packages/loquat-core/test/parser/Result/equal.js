/*
 * loquat-core test / parser.Result.equal()
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

describe(".equal(resA, resB, valEqual = undefined, inputEqual = undefined, userStateEqual = undefined)", () => {
    it("should return `true' if two results are the same", () => {
        // use default arguments
        {
            const resA = new Result(
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
                    "none"
                )
            );
            const resB = new Result(
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
                    "none"
                )
            );
            expect(Result.equal(resA, resB)).to.be.true;
        }
        // specify equal functions
        {
            const resA = new Result(
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
                    "none"
                )
            );
            const resB = new Result(
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
                "RESULT",
                new State(
                    new Config({ tabWidth: 4, unicode: true }),
                    "REST",
                    new SourcePos("foobar", 496, 28),
                    "NONE"
                )
            );
            const ieq = (strA, strB) => strA.toLowerCase() === strB.toLowerCase();
            expect(Result.equal(resA, resB, ieq, ieq, ieq)).to.be.true;
        }
    });

    it("should return `false' if two results are different", () => {
        // different `consumed'
        {
            const resA = new Result(
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
                    "none"
                )
            );
            const resB = new Result(
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
            );
            expect(Result.equal(resA, resB)).to.be.false;
        }
        // different `success'
        {
            const resA = new Result(
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
                    "none"
                )
            );
            const resB = new Result(
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
            );
            expect(Result.equal(resA, resB)).to.be.false;
        }
        // different errors
        {
            const resA = new Result(
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
                    "none"
                )
            );
            const resB = new Result(
                true,
                true,
                new ParseError(
                    new SourcePos("foobar", 6, 6),
                    [
                        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "a"),
                        new ErrorMessage(ErrorMessageType.UNEXPECT, "b"),
                        new ErrorMessage(ErrorMessageType.EXPECT, "c"),
                        new ErrorMessage(ErrorMessageType.MESSAGE, "d")
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
            expect(Result.equal(resA, resB)).to.be.false;
        }
        // different values
        {
            const resA = new Result(
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
                    "none"
                )
            );
            const resB = new Result(
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
                "ok",
                new State(
                    new Config({ tabWidth: 4, unicode: true }),
                    "rest",
                    new SourcePos("foobar", 496, 28),
                    "none"
                )
            );
            expect(Result.equal(resA, resB)).to.be.false;
        }
        // different states
        {
            const resA = new Result(
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
                    "none"
                )
            );
            const resB = new Result(
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
                    new SourcePos("foobar", 6, 28),
                    "none"
                )
            );
            expect(Result.equal(resA, resB)).to.be.false;
        }
        // all
        {
            const resA = new Result(
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
                    "none"
                )
            );
            const resB = new Result(
                false,
                false,
                new ParseError(
                    new SourcePos("foobar", 6, 6),
                    [
                        new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "a"),
                        new ErrorMessage(ErrorMessageType.UNEXPECT, "b"),
                        new ErrorMessage(ErrorMessageType.EXPECT, "c"),
                        new ErrorMessage(ErrorMessageType.MESSAGE, "d")
                    ]
                )
            );
            expect(Result.equal(resA, resB)).to.be.false;
        }
    });

    it("should compare `val' and `state' properties only when both results are success", () => {
        const ieq = () => {
            throw new Error("unexpected call");
        };
        // both are failure
        {
            const resA = new Result(
                true,
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
            const resB = new Result(
                true,
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
            expect(() => { Result.equal(resA, resB, ieq, ieq, ieq); }).not.to.throw(Error);
        }
        // one of resA or resB is failure
        {
            const resA = new Result(
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
                    "none"
                )
            );
            const resB = new Result(
                true,
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
            expect(() => { Result.equal(resA, resB, ieq, ieq, ieq); }).not.to.throw(Error);
            expect(() => { Result.equal(resB, resA, ieq, ieq, ieq); }).not.to.throw(Error);
        }
    });
});

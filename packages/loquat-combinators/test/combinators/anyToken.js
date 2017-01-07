/*
 * loquat-combinators test / combinators.anyToken
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos        = _core.SourcePos;
const ErrorMessageType = _core.ErrorMessageType;
const ErrorMessage     = _core.ErrorMessage;
const ParseError       = _core.ParseError;
const Config           = _core.Config;
const State            = _core.State;
const Result           = _core.Result;
const assertParser     = _core.assertParser;

const anyToken = _combinators.anyToken;

describe(".anyToken", () => {
    it("should return a parser that accepts any token", () => {
        assertParser(anyToken);
        // empty input
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = anyToken.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "")]
                    )
                )
            )).to.be.true;
        }
        // some input
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = anyToken.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 1)),
                    "A",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "BC",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    )
                )
            )).to.be.true;
        }
    });
});

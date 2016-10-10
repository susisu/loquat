/*
 * loquat-char test / char.noneOf()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const _core = require("loquat-core");
const show             = _core.show;
const SourcePos        = _core.SourcePos;
const ErrorMessageType = _core.ErrorMessageType;
const ErrorMessage     = _core.ErrorMessage;
const ParseError       = _core.ParseError;
const Config           = _core.Config;
const State            = _core.State;
const Result           = _core.Result;
const assertParser     = _core.assertParser;

const _char = require("char.js")(_core);
const noneOf = _char.noneOf;

describe(".noneOf(str)", () => {
    it("should return a parser that parses a character not contained by `str'", () => {
        // not contained
        {
            let initState = new State(
                new Config({ tabWidth: 8, unicode: false }),
                "ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let parser = noneOf("XYZ");
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 2)),
                    "A",
                    new State(
                        initState.config,
                        "BC",
                        new SourcePos("foobar", 1, 2),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // contained
        {
            let initState = new State(
                new Config({ tabWidth: 8 }),
                "ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let parser = noneOf("AXYZ");
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A"))]
                    )
                )
            )).to.be.true;
        }
        // empty input
        {
            let initState = new State(
                new Config({ tabWidth: 8 }),
                "",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let parser = noneOf("XYZ");
            assertParser(parser);
            let res = parser.run(initState);
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
    });

    it("should treat characters in `str' as code points if `unicode' flag of the config is `true'", () => {
        // non-unicode mode
        {
            let initState = new State(
                new Config({ tabWidth: 8, unicode: false }),
                "\uD83C\uDF63ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let parser = noneOf("\uD83C\uDF63XYZ");
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("\uD83C"))]
                    )
                )
            )).to.be.true;
        }
        // unicode mode
        {
            let initState = new State(
                new Config({ tabWidth: 8, unicode: true }),
                "\uD83C\uDF63ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let parser = noneOf("\uD83C\uDF63XYZ");
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("\uD83C\uDF63"))]
                    )
                )
            )).to.be.true;
        }
    });
});

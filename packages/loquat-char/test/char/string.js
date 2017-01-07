/*
 * loquat-char test / char.string()
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

const string = _char.string;

describe(".string(str)", () => {
    it("should return a parser that parses string (character sequence) given by `str'", () => {
        // expect empty
        {
            const initState = new State(
                new Config({ unicode: false }),
                "\uD83C\uDF63X",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = string("");
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 1)),
                    "",
                    new State(
                        new Config({ unicode: false }),
                        "\uD83C\uDF63X",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // expect many, correct input
        {
            const initState = new State(
                new Config({ unicode: false }),
                "\uD83C\uDF63X",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = string("\uD83C\uDF63");
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 3)),
                    "\uD83C\uDF63",
                    new State(
                        new Config({ unicode: false }),
                        "X",
                        new SourcePos("foobar", 1, 3),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // expect many, totally wrong input
        {
            const initState = new State(
                new Config({ unicode: false }),
                "XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = string("\uD83C\uDF63");
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "\"X\""),
                            new ErrorMessage(ErrorMessageType.EXPECT, "\"\uD83C\uDF63\"")
                        ]
                    )
                )
            )).to.be.true;
        }
        // expect many, partially wrong input
        {
            const initState = new State(
                new Config({ unicode: false }),
                "\uD83CXY",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = string("\uD83C\uDF63");
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "\"X\""),
                            new ErrorMessage(ErrorMessageType.EXPECT, "\"\uD83C\uDF63\"")
                        ]
                    )
                )
            )).to.be.true;
        }
        // expect many, no input
        {
            const initState = new State(
                new Config({ unicode: false }),
                "",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = string("\uD83C\uDF63");
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                            new ErrorMessage(ErrorMessageType.EXPECT, "\"\uD83C\uDF63\"")
                        ]
                    )
                )
            )).to.be.true;
        }
        // expect many, less input
        {
            const initState = new State(
                new Config({ unicode: false }),
                "\uD83C",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = string("\uD83C\uDF63");
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                            new ErrorMessage(ErrorMessageType.EXPECT, "\"\uD83C\uDF63\"")
                        ]
                    )
                )
            )).to.be.true;
        }
    });

    it("should treat characters as code points if unicode flag of the config is `true'", () => {
        // expect empty
        {
            const initState = new State(
                new Config({ unicode: true }),
                "\uD83C\uDF63XY",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = string("");
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 1)),
                    "",
                    new State(
                        new Config({ unicode: true }),
                        "\uD83C\uDF63XY",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    )
                ),
                undefined
            )).to.be.true;
        }
        // expect many, correct input
        {
            const initState = new State(
                new Config({ unicode: true }),
                "\uD83C\uDF63XY",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = string("\uD83C\uDF63X");
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 3)),
                    "\uD83C\uDF63X",
                    new State(
                        new Config({ unicode: true }),
                        "Y",
                        new SourcePos("foobar", 1, 3),
                        "none"
                    )
                ),
                undefined
            )).to.be.true;
        }
        // expect many, totally wrong input
        {
            const initState = new State(
                new Config({ unicode: true }),
                "XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = string("\uD83C\uDF63X");
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "\"X\""),
                            new ErrorMessage(ErrorMessageType.EXPECT, "\"\uD83C\uDF63X\"")
                        ]
                    )
                ),
                undefined
            )).to.be.true;
        }
        // expect many, partially wrong input
        {
            const initState = new State(
                new Config({ unicode: true }),
                "\uD83C\uDF63YX",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = string("\uD83C\uDF63X");
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, "\"Y\""),
                            new ErrorMessage(ErrorMessageType.EXPECT, "\"\uD83C\uDF63X\"")
                        ]
                    )
                ),
                undefined
            )).to.be.true;
        }
        // expect many, no input
        {
            const initState = new State(
                new Config({ unicode: true }),
                "",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = string("\uD83C\uDF63X");
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                            new ErrorMessage(ErrorMessageType.EXPECT, "\"\uD83C\uDF63X\"")
                        ]
                    )
                ),
                undefined
            )).to.be.true;
        }
        // expect many, less input
        {
            const initState = new State(
                new Config({ unicode: true }),
                "\uD83C\uDF63",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = string("\uD83C\uDF63X");
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                            new ErrorMessage(ErrorMessageType.EXPECT, "\"\uD83C\uDF63X\"")
                        ]
                    )
                ),
                undefined
            )).to.be.true;
        }
    });
});

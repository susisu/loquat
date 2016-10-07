/*
 * loquat-char test / char.string()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const _core = require("loquat-core");
const SourcePos        = _core.SourcePos;
const ErrorMessageType = _core.ErrorMessageType;
const ErrorMessage     = _core.ErrorMessage;
const ParseError       = _core.ParseError;
const Config           = _core.Config;
const State            = _core.State;
const Result           = _core.Result;
const assertParser     = _core.assertParser;

const _char = require("char.js")(_core);
const string = _char.string;

describe(".string(str)", () => {
    it("should return a parser that parses string (character sequence) given by `str'", () => {
        // expect empty
        {
            let initState = new State(
                new Config({ useCodePoint: false }),
                "\uD83C\uDF63X",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let parser = string("");
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 1)),
                    "",
                    new State(
                        new Config({ useCodePoint: false }),
                        "\uD83C\uDF63X",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // expect many, correct input
        {
            let initState = new State(
                new Config({ useCodePoint: false }),
                "\uD83C\uDF63X",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let parser = string("\uD83C\uDF63");
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 3)),
                    "\uD83C\uDF63",
                    new State(
                        new Config({ useCodePoint: false }),
                        "X",
                        new SourcePos("foobar", 1, 3),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // expect many, totally wrong input
        {
            let initState = new State(
                new Config({ useCodePoint: false }),
                "XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let parser = string("\uD83C\uDF63");
            assertParser(parser);
            let res = parser.run(initState);
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
            let initState = new State(
                new Config({ useCodePoint: false }),
                "\uD83CXY",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let parser = string("\uD83C\uDF63");
            assertParser(parser);
            let res = parser.run(initState);
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
            let initState = new State(
                new Config({ useCodePoint: false }),
                "",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let parser = string("\uD83C\uDF63");
            assertParser(parser);
            let res = parser.run(initState);
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
            let initState = new State(
                new Config({ useCodePoint: false }),
                "\uD83C",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let parser = string("\uD83C\uDF63");
            assertParser(parser);
            let res = parser.run(initState);
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

    it("should treat characters in code point units if useCodePoint flag of the config is `true'", () => {
        function cpArray(str) {
            let arr = [];
            for (let char of str) {
                arr.push(char);
            }
            return arr;
        }
        let arrayEqual = (xs, ys) => xs.length === ys.length && xs.every((x, i) => x === ys[i]);

        // expect empty
        {
            let initState = new State(
                new Config({ useCodePoint: true }),
                cpArray("\uD83C\uDF63XY"),
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let parser = string("");
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 1)),
                    "",
                    new State(
                        new Config({ useCodePoint: true }),
                        cpArray("\uD83C\uDF63XY"),
                        new SourcePos("foobar", 1, 1),
                        "none"
                    )
                ),
                undefined,
                arrayEqual
            )).to.be.true;
        }
        // expect many, correct input
        {
            let initState = new State(
                new Config({ useCodePoint: true }),
                cpArray("\uD83C\uDF63XY"),
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let parser = string("\uD83C\uDF63X");
            assertParser(parser);
            let res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 3)),
                    "\uD83C\uDF63X",
                    new State(
                        new Config({ useCodePoint: true }),
                        cpArray("Y"),
                        new SourcePos("foobar", 1, 3),
                        "none"
                    )
                ),
                undefined,
                arrayEqual
            )).to.be.true;
        }
        // expect many, totally wrong input
        {
            let initState = new State(
                new Config({ useCodePoint: true }),
                cpArray("XYZ"),
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let parser = string("\uD83C\uDF63X");
            assertParser(parser);
            let res = parser.run(initState);
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
                undefined,
                arrayEqual
            )).to.be.true;
        }
        // expect many, partially wrong input
        {
            let initState = new State(
                new Config({ useCodePoint: true }),
                cpArray("\uD83C\uDF63YX"),
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let parser = string("\uD83C\uDF63X");
            assertParser(parser);
            let res = parser.run(initState);
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
                undefined,
                arrayEqual
            )).to.be.true;
        }
        // expect many, no input
        {
            let initState = new State(
                new Config({ useCodePoint: true }),
                cpArray(""),
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let parser = string("\uD83C\uDF63X");
            assertParser(parser);
            let res = parser.run(initState);
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
                undefined,
                arrayEqual
            )).to.be.true;
        }
        // expect many, less input
        {
            let initState = new State(
                new Config({ useCodePoint: true }),
                cpArray("\uD83C\uDF63"),
                new SourcePos("foobar", 1, 1),
                "none"
            );
            let parser = string("\uD83C\uDF63X");
            assertParser(parser);
            let res = parser.run(initState);
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
                undefined,
                arrayEqual
            )).to.be.true;
        }
    });
});

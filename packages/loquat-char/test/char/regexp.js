/*
 * loquat-char test / char.regexp()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const show             = _core.show;
const SourcePos        = _core.SourcePos;
const ErrorMessageType = _core.ErrorMessageType;
const ErrorMessage     = _core.ErrorMessage;
const ParseError       = _core.ParseError;
const Config           = _core.Config;
const State            = _core.State;
const Result           = _core.Result;
const assertParser     = _core.assertParser;

const regexp = _char.regexp;

describe(".regexp(re, groupId = 0)", () => {
    it("should return a parser that parses characters that regular expression `re' matches,"
        + " and returns sequence specified by `groupId'", () => {
        // empty match
        {
            const initState = new State(
                new Config({ unicode: false }),
                "XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = regexp(new RegExp(""), 0);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 1)),
                    "",
                    new State(
                        new Config({ unicode: false }),
                        "XYZ",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // many match
        {
            const initState = new State(
                new Config({ unicode: false }),
                "XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = regexp(/.{2}/, 0);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 3)),
                    "XY",
                    new State(
                        new Config({ unicode: false }),
                        "Z",
                        new SourcePos("foobar", 1, 3),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // use default groupId = 0
        {
            const initState = new State(
                new Config({ unicode: false }),
                "XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = regexp(/.{2}/);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 3)),
                    "XY",
                    new State(
                        new Config({ unicode: false }),
                        "Z",
                        new SourcePos("foobar", 1, 3),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // specify groupId
        {
            const initState = new State(
                new Config({ unicode: false }),
                "XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = regexp(/.(.)/, 1);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 3)),
                    "Y",
                    new State(
                        new Config({ unicode: false }),
                        "Z",
                        new SourcePos("foobar", 1, 3),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // doesn't match
        {
            const initState = new State(
                new Config({ unicode: false }),
                "XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = regexp(/abc/, 0);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.EXPECT, show(/abc/))]
                    )
                )
            )).to.be.true;
        }
    });

    it("should ignore case if `i' flag is used", () => {
        // not used
        {
            const initState = new State(
                new Config({ unicode: false }),
                "XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = regexp(/xy/, 0);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.EXPECT, show(/xy/))]
                    )
                )
            )).to.be.true;
        }
        // used
        {
            const initState = new State(
                new Config({ unicode: false }),
                "XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = regexp(/xy/i, 0);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 3)),
                    "XY",
                    new State(
                        new Config({ unicode: false }),
                        "Z",
                        new SourcePos("foobar", 1, 3),
                        "none"
                    )
                )
            )).to.be.true;
        }
    });

    it("should match `$' at end of any line if `m' flag is used", () => {
        // not used
        {
            const initState = new State(
                new Config({ unicode: false }),
                "XY\nZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = regexp(/XY$/, 0);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.EXPECT, show(/XY$/))]
                    )
                )
            )).to.be.true;
        }
        // used
        {
            const initState = new State(
                new Config({ unicode: false }),
                "XY\nZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = regexp(/XY$/m, 0);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 3)),
                    "XY",
                    new State(
                        new Config({ unicode: false }),
                        "\nZ",
                        new SourcePos("foobar", 1, 3),
                        "none"
                    )
                )
            )).to.be.true;
        }
    });

    it("(Node.js >= 6.0.0) should enables unicode features if `u' flag is used", function () {
        // u flag is not supported by Node.js < 6.0.0
        if (parseInt(process.versions.node.split(".")[0]) < 6) {
            this.skip();
            return;
        }
        // not used
        {
            const initState = new State(
                new Config({ unicode: true }),
                "\uD83C\uDF63XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = regexp(/./, 0);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 2)),
                    "\uD83C",
                    new State(
                        new Config({ unicode: true }),
                        "\uDF63XYZ",
                        new SourcePos("foobar", 1, 2),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ unicode: true }),
                "\uD83C\uDF63XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = regexp(/\u{1F363}/, 0);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.EXPECT, show(/\u{1F363}/))]
                    )
                )
            )).to.be.true;
        }
        // used
        {
            const initState = new State(
                new Config({ unicode: true }),
                "\uD83C\uDF63XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = regexp(/./u, 0);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 2)),
                    "\uD83C\uDF63",
                    new State(
                        new Config({ unicode: true }),
                        "XYZ",
                        new SourcePos("foobar", 1, 2),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ unicode: true }),
                "\uD83C\uDF63XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = regexp(/\u{1F363}/u, 0);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 2)),
                    "\uD83C\uDF63",
                    new State(
                        new Config({ unicode: true }),
                        "XYZ",
                        new SourcePos("foobar", 1, 2),
                        "none"
                    )
                )
            )).to.be.true;
        }
    });

    it("should throw an `Error' if input is not a string", () => {
        // Array
        {
            const initState = new State(
                new Config({ unicode: true }),
                ["X", "Y", "Z"],
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = regexp(/./, 0);
            assertParser(parser);
            expect(() => { parser.run(initState); }).to.throw(Error, /regexp/);
        }
        // IStream
        {
            const initState = new State(
                new Config({ unicode: true }),
                { uncons: () => ({ empty: true }) },
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = regexp(/./, 0);
            assertParser(parser);
            expect(() => { parser.run(initState); }).to.throw(Error, /regexp/);
        }
    });
});

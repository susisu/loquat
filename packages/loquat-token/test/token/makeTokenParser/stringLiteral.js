/*
 * loquat-token test / token.makeTokenParser().stringLiteral
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const show               = _core.show;
const SourcePos          = _core.SourcePos;
const ErrorMessageType   = _core.ErrorMessageType;
const ErrorMessage       = _core.ErrorMessage;
const AbstractParseError = _core.AbstractParseError;
const ParseError         = _core.ParseError;
const Config             = _core.Config;
const State              = _core.State;
const Result             = _core.Result;
const assertParser       = _core.assertParser;

const LanguageDef = _language.LanguageDef;

const makeTokenParser = _token.makeTokenParser;

describe(".stringLiteral", () => {
    it("should parse a character literal", () => {
        const def = new LanguageDef({});
        const tp = makeTokenParser(def);
        const stringLiteral = tp.stringLiteral;
        assertParser(stringLiteral);
        // csuc
        // empty
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "\"\"XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = stringLiteral.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    "",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 1, 3),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // letter
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "\"ABC\" XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = stringLiteral.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 7),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    "ABC",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 1, 7),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // escape
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "\"AB\\\t\n \\C\"XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = stringLiteral.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 2, 5),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    "ABC",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 2, 5),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "\"AB\\&C\"XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = stringLiteral.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 8),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    "ABC",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 1, 8),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "\"AB\\10\\o12\\xA\\LF\\NUL\\^HC\"XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = stringLiteral.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 26),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    "AB\n\n\n\n\u0000\u0008C",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 1, 26),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // cerr
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "\"ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = stringLiteral.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 5),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""), // letter
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""), // escape
                            new ErrorMessage(ErrorMessageType.EXPECT, "string character"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""), // end
                            new ErrorMessage(ErrorMessageType.EXPECT, "end of string")
                        ]
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "\"\n\"XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = stringLiteral.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("\n")), // letter
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("\n")), // escape
                            new ErrorMessage(ErrorMessageType.EXPECT, "string character"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("\n")), // end
                            new ErrorMessage(ErrorMessageType.EXPECT, "end of string")
                        ]
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "\"\\ XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = stringLiteral.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 4),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "space"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "end of string gap")
                        ]
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "\"\\?XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = stringLiteral.run(initState);
            expect(res).to.be.an.instanceOf(Result);
            expect(res.consumed).to.be.true;
            expect(res.success).to.be.false;
            expect(res.err).to.be.an.instanceOf(AbstractParseError);
            expect(SourcePos.equal(
                res.err.pos,
                new SourcePos("foobar", 1, 3)
            )).to.be.true;
            expect(
                res.err.msgs.some(msg =>
                    msg.type === ErrorMessageType.SYSTEM_UNEXPECT
                    && msg.msgStr === show("?")
                )
            ).to.be.true;
            expect(
                res.err.msgs.some(msg =>
                    msg.type === ErrorMessageType.EXPECT
                    && msg.msgStr === "escape code"
                )
            ).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "\"\\oU\"XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = stringLiteral.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 4),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "octal digit")
                        ]
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "\"\\xU\"XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = stringLiteral.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 4),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "hexadecimal digit")
                        ]
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "\"\\^?\"XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = stringLiteral.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 4),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("?")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "uppercase letter")
                        ]
                    )
                )
            )).to.be.true;
        }
        // eerr
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = stringLiteral.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "literal string")
                        ]
                    )
                )
            )).to.be.true;
        }
    });
});

/*
 * loquat-token test / token.makeTokenParser().charLiteral
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

describe(".charLiteral", () => {
    it("should parse a character literal", () => {
        const def = new LanguageDef({});
        const tp = makeTokenParser(def);
        const charLiteral = tp.charLiteral;
        assertParser(charLiteral);
        // csuc
        // letter
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "'A' XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = charLiteral.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 5),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    "A",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 1, 5),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // escape
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "'\\n'XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = charLiteral.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 5),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    "\n",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 1, 5),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "'\\10'XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = charLiteral.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 6),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    "\n",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 1, 6),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "'\\o12'XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = charLiteral.run(initState);
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
                    "\n",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 1, 7),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "'\\xA'XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = charLiteral.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 6),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    "\n",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 1, 6),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "'\\LF'XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = charLiteral.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 6),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    "\n",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 1, 6),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "'\\NUL'XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = charLiteral.run(initState);
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
                    "\u0000",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 1, 7),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "'\\^H'XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = charLiteral.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 6),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    "\u0008",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 1, 6),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // cerr
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "'XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = charLiteral.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("Y")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "end of character")
                        ]
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "''XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = charLiteral.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("'")),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("'")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "literal character")
                        ]
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "'\n'XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = charLiteral.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("\n")),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("\n")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "literal character")
                        ]
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "'\\?XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = charLiteral.run(initState);
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
                "'\\oU'XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = charLiteral.run(initState);
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
                "'\\xU'XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = charLiteral.run(initState);
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
                "'\\^?'XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = charLiteral.run(initState);
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
            const res = charLiteral.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "character")
                        ]
                    )
                )
            )).to.be.true;
        }
    });
});

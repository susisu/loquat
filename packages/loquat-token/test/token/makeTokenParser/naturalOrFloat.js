/*
 * loquat-token test / token.makeTokenParser().naturalOrFloat
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

const LanguageDef = _language.LanguageDef;

const makeTokenParser = _token.makeTokenParser;

const EPS = 1e-15;

function floatEqual(x, y) {
    const m = Math.abs(Math.max(x, y));
    return m === 0
        ? Math.abs(x - y) < EPS
        : Math.abs(x - y) / m < EPS;
}

function objEqual(x, y) {
    return typeof x === "object" && typeof y === "object"
        && x !== null && y !== null
        && x.type === y.type && floatEqual(x.value, y.value);
}

describe(".naturalOrFloat", () => {
    it("should parse a natural or floating-point number"
        + " and return the result as an object with `type' and `value'", () => {
        const def = new LanguageDef({});
        const tp = makeTokenParser(def);
        const naturalOrFloat = tp.naturalOrFloat;
        assertParser(naturalOrFloat);
        // csuc
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "0xABCDEF.06789UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = naturalOrFloat.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 9),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show(".")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "hexadecimal digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show(".")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    { type: "natural", value: 0xABCDEF },
                    new State(
                        new Config({ tabWidth: 8 }),
                        ".06789UVW",
                        new SourcePos("foobar", 1, 9),
                        "none"
                    )
                ),
                objEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "0o12345670.06789UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = naturalOrFloat.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 11),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show(".")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "octal digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show(".")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    { type: "natural", value: 2739128 }, // 0o12345670
                    new State(
                        new Config({ tabWidth: 8 }),
                        ".06789UVW",
                        new SourcePos("foobar", 1, 11),
                        "none"
                    )
                ),
                objEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "01234567890UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = naturalOrFloat.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 12),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "fraction"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "exponent"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    { type: "natural", value: 1234567890 },
                    new State(
                        new Config({ tabWidth: 8 }),
                        "UVW",
                        new SourcePos("foobar", 1, 12),
                        "none"
                    )
                ),
                objEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "09876.5432e-10UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = naturalOrFloat.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 15),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    { type: "float", value: 9876.5432e-10 },
                    new State(
                        new Config({ tabWidth: 8 }),
                        "UVW",
                        new SourcePos("foobar", 1, 15),
                        "none"
                    )
                ),
                objEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "0.5432e-10UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = naturalOrFloat.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 11),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    { type: "float", value: 0.5432e-10 },
                    new State(
                        new Config({ tabWidth: 8 }),
                        "UVW",
                        new SourcePos("foobar", 1, 11),
                        "none"
                    )
                ),
                objEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "0UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = naturalOrFloat.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // hexadecimal
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // octal
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // decimal
                            new ErrorMessage(ErrorMessageType.EXPECT, "digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "fraction"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "exponent"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    { type: "natural", value: 0 },
                    new State(
                        new Config({ tabWidth: 8 }),
                        "UVW",
                        new SourcePos("foobar", 1, 2),
                        "none"
                    )
                ),
                objEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "1234567890UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = naturalOrFloat.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 11),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "fraction"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "exponent"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    { type: "natural", value: 1234567890 },
                    new State(
                        new Config({ tabWidth: 8 }),
                        "UVW",
                        new SourcePos("foobar", 1, 11),
                        "none"
                    )
                ),
                objEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "9876.5432e-10 UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = naturalOrFloat.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 15),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    { type: "float", value: 9876.5432e-10 },
                    new State(
                        new Config({ tabWidth: 8 }),
                        "UVW",
                        new SourcePos("foobar", 1, 15),
                        "none"
                    )
                ),
                objEqual
            )).to.be.true;
        }
        // cerr
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "0xUVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = naturalOrFloat.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "hexadecimal digit")
                        ]
                    )
                ),
                objEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "0oUVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = naturalOrFloat.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "octal digit")
                        ]
                    )
                ),
                objEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "0.UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = naturalOrFloat.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "fraction")
                        ]
                    )
                ),
                objEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "0eUVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = naturalOrFloat.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, show("-")),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, show("+")),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "exponent")
                        ]
                    )
                ),
                objEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "0e-UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = naturalOrFloat.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 4),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "exponent")
                        ]
                    )
                ),
                objEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "987.UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = naturalOrFloat.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 5),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "fraction")
                        ]
                    )
                ),
                objEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "987eUVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = naturalOrFloat.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 5),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, show("-")),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, show("+")),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "exponent")
                        ]
                    )
                ),
                objEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "987e-UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = naturalOrFloat.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 6),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "exponent")
                        ]
                    )
                ),
                objEqual
            )).to.be.true;
        }
        // eerr
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = naturalOrFloat.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // 0
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")), // decimal
                            new ErrorMessage(ErrorMessageType.EXPECT, "number")
                        ]
                    )
                ),
                objEqual
            )).to.be.true;
        }
    });
});

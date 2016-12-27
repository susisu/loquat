/*
 * loquat-token test / token.makeTokenParser().float
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

const LanguageDef = _language.LanguageDef;

const makeTokenParser = _token.makeTokenParser;

const EPS = 1e-15;

function floatEqual(x, y) {
    const m = Math.abs(Math.max(x, y));
    return m === 0
        ? Math.abs(x - y) < EPS
        : Math.abs(x - y) / m < EPS;
}

describe(".float", () => {
    it("should parse a floating-point number", () => {
        const def = new LanguageDef({});
        const tp = makeTokenParser(def);
        const float = tp.float;
        assertParser(float);
        // csuc
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "12345.06789XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = float.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 12),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "exponent"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    12345.06789,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 1, 12),
                        "none"
                    )
                ),
                floatEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "98765432E10XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = float.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 12),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    98765432e+10,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 1, 12),
                        "none"
                    )
                ),
                floatEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "98765432e+10XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = float.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 13),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    98765432e+10,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 1, 13),
                        "none"
                    )
                ),
                floatEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "98765432e-10XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = float.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 13),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    98765432e-10,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 1, 13),
                        "none"
                    )
                ),
                floatEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "9876.5432e-10XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = float.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 14),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    9876.5432e-10,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 1, 14),
                        "none"
                    )
                ),
                floatEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "9876.5432e-10 XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = float.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 15),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    9876.5432e-10,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 1, 15),
                        "none"
                    )
                ),
                floatEqual
            )).to.be.true;
        }
        // cerr
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "123XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = float.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 4),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "digit"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "fraction"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "exponent")
                        ]
                    )
                ),
                floatEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "123.XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = float.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 5),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "fraction")
                        ]
                    )
                ),
                floatEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "123eXYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = float.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 5),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, show("-")),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, show("+")),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "exponent")
                        ]
                    )
                ),
                floatEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "123e-XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = float.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 6),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "exponent")
                        ]
                    )
                ),
                floatEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "123e+XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = float.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 6),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "exponent")
                        ]
                    )
                ),
                floatEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "123.456eXYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = float.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 9),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, show("-")),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, show("+")),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "exponent")
                        ]
                    )
                ),
                floatEqual
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
            const res = float.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "float")
                        ]
                    )
                ),
                floatEqual
            )).to.be.true;
        }
    });
});

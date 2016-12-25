/*
 * loquat-token test / token.makeTokenParser().octal
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

describe(".octal", () => {
    it("should parse octal digits after a character O/o and return an integer", () => {
        const def = new LanguageDef({});
        const tp = makeTokenParser(def);
        const octal = tp.octal;
        assertParser(octal);
        // csuc
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "O12345670UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = octal.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 10),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "octal digit")
                        ]
                    ),
                    2739128, // 0o12345670
                    new State(
                        new Config({ tabWidth: 8 }),
                        "UVW",
                        new SourcePos("foobar", 1, 10),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "o12345670 UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = octal.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 10),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show(" ")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "octal digit")
                        ]
                    ),
                    2739128, // 0o12345670
                    new State(
                        new Config({ tabWidth: 8 }),
                        " UVW",
                        new SourcePos("foobar", 1, 10),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // cerr
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "oUVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = octal.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "octal digit")
                        ]
                    )
                )
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
            const res = octal.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U"))]
                    )
                )
            )).to.be.true;
        }
    });
});

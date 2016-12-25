/*
 * loquat-token test / token.makeTokenParser().hexadecimal
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

describe(".hexadecimal", () => {
    it("should parse hexadecimal digits after a character X/x and return an integer", () => {
        const def = new LanguageDef({});
        const tp = makeTokenParser(def);
        const hexadecimal = tp.hexadecimal;
        assertParser(hexadecimal);
        // csuc
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "X12345678UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = hexadecimal.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 10),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "hexadecimal digit")
                        ]
                    ),
                    0x12345678,
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
                "x90ABCDEF UVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = hexadecimal.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 10),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show(" ")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "hexadecimal digit")
                        ]
                    ),
                    0x90ABCDEF,
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
                "xUVW",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = hexadecimal.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("U")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "hexadecimal digit")
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
            const res = hexadecimal.run(initState);
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

/*
 * loquat-token test / token.makeTokenParser().decimal
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

describe(".decimal", () => {
    it("should parse decimal digits and return an integer", () => {
        const def = new LanguageDef({});
        const tp = makeTokenParser(def);
        const decimal = tp.decimal;
        assertParser(decimal);
        // csuc
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "1234567890XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = decimal.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 11),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "digit")
                        ]
                    ),
                    1234567890,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 1, 11),
                        "none"
                    )
                )
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "1234567890 XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = decimal.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 11),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show(" ")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "digit")
                        ]
                    ),
                    1234567890,
                    new State(
                        new Config({ tabWidth: 8 }),
                        " XYZ",
                        new SourcePos("foobar", 1, 11),
                        "none"
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
            const res = decimal.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "digit")
                        ]
                    )
                )
            )).to.be.true;
        }
    });
});

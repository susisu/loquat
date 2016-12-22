/*
 * loquat-token test / token.makeTokenParser().colon
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

describe(".colon", () => {
    it("should parse a colon", () => {
        const def = new LanguageDef({});
        const tp = makeTokenParser(def);
        const colon = tp.colon;
        assertParser(colon);
        // csuc
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                ": ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = colon.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    ":",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "ABC",
                        new SourcePos("foobar", 1, 3),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // eerr
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = colon.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                            new ErrorMessage(ErrorMessageType.EXPECT, show(":"))
                        ]
                    )
                )
            )).to.be.true;
        }
    });
});

/*
 * loquat-token test / token.makeTokenParser().symbol()
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

describe(".symbol(name)", () => {
    it("should return a parser that parses string `name' and skips trailing spaces and comments", () => {
        const def = new LanguageDef({
            commentLine   : "--",
            commentStart  : "{-",
            commentEnd    : "-}",
            nestedComments: true
        });
        const tp = makeTokenParser(def);
        const symbol = tp.symbol;
        expect(symbol).to.be.a("function");
        // csuc
        {
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "ABC",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const parser = symbol("AB");
                assertParser(parser);
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 3),
                            [
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("C")),
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("C")),
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("C")),
                                new ErrorMessage(ErrorMessageType.EXPECT, "")
                            ]
                        ),
                        "AB",
                        new State(
                            new Config({ tabWidth: 8 }),
                            "C",
                            new SourcePos("foobar", 1, 3),
                            "none"
                        )
                    )
                )).to.be.true;
            }
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "AB{- nyan\ncat -}\n \f\r\v{----}\n-- foobar\n\tC",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const parser = symbol("AB");
                assertParser(parser);
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(
                        new ParseError(
                            new SourcePos("foobar", 5, 9),
                            [
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("C")),
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("C")),
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("C")),
                                new ErrorMessage(ErrorMessageType.EXPECT, "")
                            ]
                        ),
                        "AB",
                        new State(
                            new Config({ tabWidth: 8 }),
                            "C",
                            new SourcePos("foobar", 5, 9),
                            "none"
                        )
                    )
                )).to.be.true;
            }
        }
        // cerr
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const parser = symbol("AD");
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("B")),
                            new ErrorMessage(ErrorMessageType.EXPECT, show("AD"))
                        ]
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
            const parser = symbol("DE");
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                            new ErrorMessage(ErrorMessageType.EXPECT, show("DE"))
                        ]
                    )
                )
            )).to.be.true;
        }
    });
});

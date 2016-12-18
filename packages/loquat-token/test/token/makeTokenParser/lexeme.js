/*
 * loquat-token test / token.makeTokenParser().lexeme()
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
const Parser           = _core.Parser;
const assertParser     = _core.assertParser;

const LanguageDef = _language.LanguageDef;

const makeTokenParser = _token.makeTokenParser;

describe(".lexeme(parser)", () => {
    it("should return a parser that skips trailing spaces and comments", () => {
        const def = new LanguageDef({
            commentLine   : "--",
            commentStart  : "{-",
            commentEnd    : "-}",
            nestedComments: true
        });
        const tp = makeTokenParser(def);
        const lexeme = tp.lexeme;
        expect(lexeme).to.be.a("function");
        // csuc
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const p = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                    ),
                    "nyancat",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "{- nyan\ncat -}\n \f\r\v{----}\n-- foobar\n\tXYZ",
                        new SourcePos("foobar", 1, 2),
                        "some"
                    )
                );
            });
            const parser = lexeme(p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 5, 9),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    "nyancat",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 5, 9),
                        "some"
                    )
                )
            )).to.be.true;
        }
        // cerr
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const p = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                    )
                );
            });
            const parser = lexeme(p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 2),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                    )
                )
            )).to.be.true;
        }
        // esuc
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "ABC",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const p = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                    ),
                    "nyancat",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "{- nyan\ncat -}\n \f\r\v{----}\n-- foobar\n\tXYZ",
                        new SourcePos("foobar", 1, 1),
                        "some"
                    )
                );
            });
            const parser = lexeme(p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 5, 9),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    "nyancat",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 5, 9),
                        "some"
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
            const p = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                    )
                );
            });
            const parser = lexeme(p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                    )
                )
            )).to.be.true;
        }
    });
});

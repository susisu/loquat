/*
 * loquat-token test / token.makeTokenParser().parens()
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

describe(".parens(parser)", () => {
    it("should return a parser that parses token between parens", () => {
        const def = new LanguageDef({});
        const tp = makeTokenParser(def);
        const parens = tp.parens;
        expect(parens).to.be.a("function");
        // csuc
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "( ABC ) DEF",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const p = new Parser(state => {
                expect(State.equal(
                    state,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "ABC ) DEF",
                        new SourcePos("foobar", 1, 3),
                        "none"
                    )
                )).to.be.true;
                return Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 7),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                    ),
                    "nyancat",
                    new State(
                        new Config({ tabWidth: 8 }),
                        ") XYZ",
                        new SourcePos("foobar", 1, 7),
                        "some"
                    )
                );
            });
            const parser = parens(p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 9),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "")
                        ]
                    ),
                    "nyancat",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 1, 9),
                        "some"
                    )
                )
            )).to.be.true;
        }
        // cerr
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "( ABC ) DEF",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const p = new Parser(state => {
                expect(State.equal(
                    state,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "ABC ) DEF",
                        new SourcePos("foobar", 1, 3),
                        "none"
                    )
                )).to.be.true;
                return Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 7),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                    )
                );
            });
            const parser = parens(p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 7),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                    )
                )
            )).to.be.true;
        }
        // esuc
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "( ABC ) DEF",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const p = new Parser(state => {
                expect(State.equal(
                    state,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "ABC ) DEF",
                        new SourcePos("foobar", 1, 3),
                        "none"
                    )
                )).to.be.true;
                return Result.esuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                    ),
                    "nyancat",
                    new State(
                        new Config({ tabWidth: 8 }),
                        ") XYZ",
                        new SourcePos("foobar", 1, 3),
                        "some"
                    )
                );
            });
            const parser = parens(p);
            assertParser(parser);
            const res = parser.run(initState);
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
                    "nyancat",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 1, 5),
                        "some"
                    )
                )
            )).to.be.true;
        }
        // eerr
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "( ABC ) DEF",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const p = new Parser(state => {
                expect(State.equal(
                    state,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "ABC ) DEF",
                        new SourcePos("foobar", 1, 3),
                        "none"
                    )
                )).to.be.true;
                return Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                    )
                );
            });
            const parser = parens(p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                            new ErrorMessage(ErrorMessageType.EXPECT, ""),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "test")
                        ]
                    )
                )
            )).to.be.true;
        }
        // not parens
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "ABC ) DEF",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const p = new Parser(() => { throw new Error("unexpected call"); });
            const parser = parens(p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                            new ErrorMessage(ErrorMessageType.EXPECT, show("("))
                        ]
                    )
                )
            )).to.be.true;
        }
        // not closed
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "( ABC ) DEF",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const p = new Parser(state => {
                expect(State.equal(
                    state,
                    new State(
                        new Config({ tabWidth: 8 }),
                        "ABC ) DEF",
                        new SourcePos("foobar", 1, 3),
                        "none"
                    )
                )).to.be.true;
                return Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 7),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                    ),
                    "nyancat",
                    new State(
                        new Config({ tabWidth: 8 }),
                        "XYZ",
                        new SourcePos("foobar", 1, 7),
                        "some"
                    )
                );
            });
            const parser = parens(p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 7),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "test"),
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, show(")"))
                        ]
                    )
                )
            )).to.be.true;
        }
    });
});

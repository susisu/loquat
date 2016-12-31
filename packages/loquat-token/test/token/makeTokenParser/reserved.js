/*
 * loquat-token test / token.makeTokenParser().identifier
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const show               = _core.show;
const uncons             = _core.uncons;
const SourcePos          = _core.SourcePos;
const ErrorMessageType   = _core.ErrorMessageType;
const ErrorMessage       = _core.ErrorMessage;
const ParseError         = _core.ParseError;
const Config             = _core.Config;
const State              = _core.State;
const Result             = _core.Result;
const Parser             = _core.Parser;
const assertParser       = _core.assertParser;

const LanguageDef = _language.LanguageDef;

const makeTokenParser = _token.makeTokenParser;

function genCharParser(re) {
    return new Parser(state => {
        const unconsed = uncons(state.input, state.config.unicode);
        if (unconsed.empty) {
            return Result.eerr(
                new ParseError(
                    state.pos,
                    [new ErrorMessage(ErrorMessageType.MESSAGE, "e")]
                )
            );
        }
        else {
            if (re.test(unconsed.head)) {
                const newPos = state.pos.addChar(unconsed.head, state.config.tabWidth);
                return Result.csuc(
                    new ParseError(
                        newPos,
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "C")]
                    ),
                    unconsed.head,
                    new State(
                        state.config,
                        unconsed.tail,
                        newPos,
                        state.userState
                    )
                );
            }
            else {
                return Result.eerr(
                    new ParseError(
                        state.pos,
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "e")]
                    )
                );
            }
        }
    });
}

const idStart = genCharParser(/[A-Za-z]/);
const idLetter = genCharParser(/[0-9A-Za-z]/);

describe(".reserved(name)", () => {
    context("when `caseSensitive' is true", () => {
        it("should parse a reserved word `name'", () => {
            const def = new LanguageDef({
                idStart      : idStart,
                idLetter     : idLetter,
                caseSensitive: true
            });
            const tp = makeTokenParser(def);
            const reserved = tp.reserved;
            expect(reserved).to.be.a("function");
            const parser = reserved("nyan0CAT");
            assertParser(parser);
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "nyan0CAT XYZ",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 10),
                            [
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                                new ErrorMessage(ErrorMessageType.EXPECT, "")
                            ]
                        ),
                        undefined,
                        new State(
                            new Config({ tabWidth: 8 }),
                            "XYZ",
                            new SourcePos("foobar", 1, 10),
                            "none"
                        )
                    )
                )).to.be.true;
            }
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "NYAN0CAT XYZ",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.eerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 1),
                            [
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("N")),
                                new ErrorMessage(ErrorMessageType.EXPECT, show("nyan0CAT"))
                            ]
                        )
                    )
                )).to.be.true;
            }
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "nyan XYZ",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.eerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 1),
                            [
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show(" ")),
                                new ErrorMessage(ErrorMessageType.EXPECT, show("nyan0CAT"))
                            ]
                        )
                    )
                )).to.be.true;
            }
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "nyan0CATXYZ",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.eerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 10),
                            [
                                new ErrorMessage(ErrorMessageType.MESSAGE, "C"),
                                new ErrorMessage(ErrorMessageType.UNEXPECT, show("X")),
                                new ErrorMessage(ErrorMessageType.EXPECT, "end of " + show("nyan0CAT"))
                            ]
                        )
                    )
                )).to.be.true;
            }
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "XYZ",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.eerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 1),
                            [
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                                new ErrorMessage(ErrorMessageType.EXPECT, show("nyan0CAT"))
                            ]
                        )
                    )
                )).to.be.true;
            }
        });
    });

    context("when `caseSensitive' is false", () => {
        it("should parse a reserved word `name', without considering case", () => {
            const def = new LanguageDef({
                idStart      : idStart,
                idLetter     : idLetter,
                caseSensitive: false
            });
            const tp = makeTokenParser(def);
            const reserved = tp.reserved;
            expect(reserved).to.be.a("function");
            const parser = reserved("nyan0CAT");
            assertParser(parser);
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "nyan0CAT XYZ",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 10),
                            [
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                                new ErrorMessage(ErrorMessageType.EXPECT, "")
                            ]
                        ),
                        undefined,
                        new State(
                            new Config({ tabWidth: 8 }),
                            "XYZ",
                            new SourcePos("foobar", 1, 10),
                            "none"
                        )
                    )
                )).to.be.true;
            }
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "NYAN0cat XYZ",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 10),
                            [
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                                new ErrorMessage(ErrorMessageType.EXPECT, "")
                            ]
                        ),
                        undefined,
                        new State(
                            new Config({ tabWidth: 8 }),
                            "XYZ",
                            new SourcePos("foobar", 1, 10),
                            "none"
                        )
                    )
                )).to.be.true;
            }
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "nyan XYZ",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.eerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 5),
                            [
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show(" ")),
                                new ErrorMessage(ErrorMessageType.EXPECT, show("nyan0CAT"))
                            ]
                        )
                    )
                )).to.be.true;
            }
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "nyan0 XYZ",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.eerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 6),
                            [
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show(" ")),
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show(" ")),
                                new ErrorMessage(ErrorMessageType.EXPECT, show("nyan0CAT"))
                            ]
                        )
                    )
                )).to.be.true;
            }
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "nyan0CATXYZ",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.eerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 10),
                            [
                                new ErrorMessage(ErrorMessageType.MESSAGE, "C"),
                                new ErrorMessage(ErrorMessageType.UNEXPECT, show("X")),
                                new ErrorMessage(ErrorMessageType.EXPECT, "end of " + show("nyan0CAT"))
                            ]
                        )
                    )
                )).to.be.true;
            }
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "XYZ",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.eerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 1),
                            [
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                                new ErrorMessage(ErrorMessageType.EXPECT, show("nyan0CAT"))
                            ]
                        )
                    )
                )).to.be.true;
            }
        });
    });
});

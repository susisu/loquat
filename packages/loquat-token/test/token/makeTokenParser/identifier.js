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

describe(".identifier", () => {
    context("when `caseSensitive' is true", () => {
        it("should parse an identifier", () => {
            const def = new LanguageDef({
                idStart      : idStart,
                idLetter     : idLetter,
                caseSensitive: true
            });
            const tp = makeTokenParser(def);
            const identifier = tp.identifier;
            assertParser(identifier);
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "nyan0CAT XYZ",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = identifier.run(initState);
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
                        "nyan0CAT",
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
                    "0nyanCAT XYZ",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = identifier.run(initState);
                expect(Result.equal(
                    res,
                    Result.eerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 1),
                            [
                                new ErrorMessage(ErrorMessageType.MESSAGE, "e"),
                                new ErrorMessage(ErrorMessageType.EXPECT, "identifier")
                            ]
                        )
                    )
                )).to.be.true;
            }
        });

        it("should not accept reserved word", () => {
            {
                const def = new LanguageDef({
                    idStart      : idStart,
                    idLetter     : idLetter,
                    reservedIds  : [],
                    caseSensitive: true
                });
                const tp = makeTokenParser(def);
                const identifier = tp.identifier;
                assertParser(identifier);
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "if XYZ",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = identifier.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("foobar", 1, 4),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            "if",
                            new State(
                                new Config({ tabWidth: 8 }),
                                "XYZ",
                                new SourcePos("foobar", 1, 4),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "IF XYZ",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = identifier.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("foobar", 1, 4),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            "IF",
                            new State(
                                new Config({ tabWidth: 8 }),
                                "XYZ",
                                new SourcePos("foobar", 1, 4),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
            }
            {
                const def = new LanguageDef({
                    idStart      : idStart,
                    idLetter     : idLetter,
                    reservedIds  : ["if", "then", "else", "let", "in", "do"],
                    caseSensitive: true
                });
                const tp = makeTokenParser(def);
                const identifier = tp.identifier;
                assertParser(identifier);
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "if XYZ",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = identifier.run(initState);
                    expect(Result.equal(
                        res,
                        Result.eerr(
                            new ParseError(
                                new SourcePos("foobar", 1, 3),
                                [
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "e"),
                                    new ErrorMessage(ErrorMessageType.UNEXPECT, "reserved word " + show("if"))
                                ]
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "IF XYZ",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = identifier.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("foobar", 1, 4),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            "IF",
                            new State(
                                new Config({ tabWidth: 8 }),
                                "XYZ",
                                new SourcePos("foobar", 1, 4),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
            }
        });
    });

    context("when `caseSensitive' is false", () => {
        it("should parse an identifier", () => {
            const def = new LanguageDef({
                idStart      : idStart,
                idLetter     : idLetter,
                caseSensitive: false
            });
            const tp = makeTokenParser(def);
            const identifier = tp.identifier;
            assertParser(identifier);
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "nyan0CAT XYZ",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = identifier.run(initState);
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
                        "nyan0CAT",
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
                    "0nyanCAT XYZ",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = identifier.run(initState);
                expect(Result.equal(
                    res,
                    Result.eerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 1),
                            [
                                new ErrorMessage(ErrorMessageType.MESSAGE, "e"),
                                new ErrorMessage(ErrorMessageType.EXPECT, "identifier")
                            ]
                        )
                    )
                )).to.be.true;
            }
        });

        it("should not accept reserved word", () => {
            {
                const def = new LanguageDef({
                    idStart      : idStart,
                    idLetter     : idLetter,
                    reservedIds  : [],
                    caseSensitive: false
                });
                const tp = makeTokenParser(def);
                const identifier = tp.identifier;
                assertParser(identifier);
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "if XYZ",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = identifier.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("foobar", 1, 4),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            "if",
                            new State(
                                new Config({ tabWidth: 8 }),
                                "XYZ",
                                new SourcePos("foobar", 1, 4),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "IF XYZ",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = identifier.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("foobar", 1, 4),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            "IF",
                            new State(
                                new Config({ tabWidth: 8 }),
                                "XYZ",
                                new SourcePos("foobar", 1, 4),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
            }
            {
                const def = new LanguageDef({
                    idStart      : idStart,
                    idLetter     : idLetter,
                    reservedIds  : ["if", "then", "else", "let", "in", "do"],
                    caseSensitive: false
                });
                const tp = makeTokenParser(def);
                const identifier = tp.identifier;
                assertParser(identifier);
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "if XYZ",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = identifier.run(initState);
                    expect(Result.equal(
                        res,
                        Result.eerr(
                            new ParseError(
                                new SourcePos("foobar", 1, 3),
                                [
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "e"),
                                    new ErrorMessage(ErrorMessageType.UNEXPECT, "reserved word " + show("if"))
                                ]
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "IF XYZ",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = identifier.run(initState);
                    expect(Result.equal(
                        res,
                        Result.eerr(
                            new ParseError(
                                new SourcePos("foobar", 1, 3),
                                [
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "e"),
                                    new ErrorMessage(ErrorMessageType.UNEXPECT, "reserved word " + show("IF"))
                                ]
                            )
                        )
                    )).to.be.true;
                }
            }
        });
    });
});

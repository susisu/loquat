/*
 * loquat-token test / token.makeTokenParser().whiteSpace
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

describe(".whiteSpace", () => {
    context("when none of one-line and multi-line comments are given", () => {
        const defs = [
            new LanguageDef({
                nestedComments: false
            }),
            new LanguageDef({
                commentLine   : "",
                commentStart  : "",
                commentEnd    : "",
                nestedComments: false
            }),
            new LanguageDef({
                nestedComments: true
            }),
            new LanguageDef({
                commentLine   : "",
                commentStart  : "",
                commentEnd    : "",
                nestedComments: true
            })
        ];

        it("should skip simple white space characters", () => {
            for (const def of defs) {
                const tp = makeTokenParser(def);
                const whiteSpace = tp.whiteSpace;
                assertParser(whiteSpace);
                // no white space
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "ABC",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("test", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "ABC",
                                new SourcePos("test", 1, 1),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("test", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "",
                                new SourcePos("test", 1, 1),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                // some white spaces
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        " \f\r\v\n\tABC",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("test", 2, 9),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "ABC",
                                new SourcePos("test", 2, 9),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        " \f\r\v\n\t",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("test", 2, 9),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "",
                                new SourcePos("test", 2, 9),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
            }
        });
    });

    context("when only one-line comment is given", () => {
        const defs = [
            new LanguageDef({
                commentLine   : "//",
                nestedComments: false
            }),
            new LanguageDef({
                commentLine   : "//",
                commentStart  : "",
                commentEnd    : "",
                nestedComments: false
            }),
            new LanguageDef({
                commentLine   : "//",
                nestedComments: true
            }),
            new LanguageDef({
                commentLine   : "//",
                commentStart  : "",
                commentEnd    : "",
                nestedComments: true
            })
        ];

        it("should skip spaces and one-line comment", () => {
            for (const def of defs) {
                const tp = makeTokenParser(def);
                const whiteSpace = tp.whiteSpace;
                assertParser(whiteSpace);
                // no spaces and comments
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "ABC",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("test", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "ABC",
                                new SourcePos("test", 1, 1),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "/ABC",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("test", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("/")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "/ABC",
                                new SourcePos("test", 1, 1),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("test", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "",
                                new SourcePos("test", 1, 1),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                // some spaces and comments
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "// nyancat\n \f\r\v////\n\n\tABC",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("test", 4, 9),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "ABC",
                                new SourcePos("test", 4, 9),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "// nyancat\n \f\r\v////\n\n\t/ABC",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("test", 4, 9),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("/")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "/ABC",
                                new SourcePos("test", 4, 9),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "// nyancat\n \f\r\v////\n\n\t",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("test", 4, 9),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "",
                                new SourcePos("test", 4, 9),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                // comment in the last line
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "// nyancat",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("test", 1, 11),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "",
                                new SourcePos("test", 1, 11),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "//",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("test", 1, 3),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "",
                                new SourcePos("test", 1, 3),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
            }
        });
    });

    context("when only multi-line comment is given without allowing nested comments", () => {
        const defs = [
            new LanguageDef({
                commentStart  : "/*",
                commentEnd    : "*/",
                nestedComments: false
            }),
            new LanguageDef({
                commentLine   : "",
                commentStart  : "/*",
                commentEnd    : "*/",
                nestedComments: false
            })
        ];

        it("should skip spaces and multi-line comments", () => {
            for (const def of defs) {
                const tp = makeTokenParser(def);
                const whiteSpace = tp.whiteSpace;
                assertParser(whiteSpace);
                // no spaces and comments
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "ABC",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("test", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "ABC",
                                new SourcePos("test", 1, 1),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "/ABC",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("test", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("/")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "/ABC",
                                new SourcePos("test", 1, 1),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("test", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "",
                                new SourcePos("test", 1, 1),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                // some spaces and comments
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "/* nyan\ncat */\n \f\r\v/****/\n\tABC",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("test", 4, 9),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "ABC",
                                new SourcePos("test", 4, 9),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "/* nyan\ncat */\n \f\r\v/****/\n\t/ABC",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("test", 4, 9),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("/")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "/ABC",
                                new SourcePos("test", 4, 9),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "/* nyan\ncat */\n \f\r\v/****/\n\t",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("test", 4, 9),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "",
                                new SourcePos("test", 4, 9),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                // unclosed comment
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "/* nyan\ncat",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.cerr(
                            new ParseError(
                                new SourcePos("test", 2, 4),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "end of comment")
                                ]
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "/*",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.cerr(
                            new ParseError(
                                new SourcePos("test", 1, 3),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "end of comment")
                                ]
                            )
                        )
                    )).to.be.true;
                }
            }
        });

        it("should not allow nested comments", () => {
            for (const def of defs) {
                const tp = makeTokenParser(def);
                const whiteSpace = tp.whiteSpace;
                assertParser(whiteSpace);
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "/*\n/* nyan\ncat */\n*/\nABC",
                    new SourcePos("test", 1, 1),
                    "none"
                );
                const res = whiteSpace.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(
                        new ParseError(
                            new SourcePos("test", 4, 1),
                            [
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("*")),
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("*")),
                                new ErrorMessage(ErrorMessageType.EXPECT, "")
                            ]
                        ),
                        undefined,
                        new State(
                            new Config({ tabWidth: 8 }),
                            "*/\nABC",
                            new SourcePos("test", 4, 1),
                            "none"
                        )
                    )
                )).to.be.true;
            }
        });
    });

    context("when only multi-line comment is given with allowing nested comments", () => {
        const defs = [
            new LanguageDef({
                commentStart  : "{-",
                commentEnd    : "-}",
                nestedComments: true
            }),
            new LanguageDef({
                commentLine   : "",
                commentStart  : "{-",
                commentEnd    : "-}",
                nestedComments: true
            })
        ];

        it("should skip spaces and multi-line comments", () => {
            for (const def of defs) {
                const tp = makeTokenParser(def);
                const whiteSpace = tp.whiteSpace;
                assertParser(whiteSpace);
                // no spaces and comments
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "ABC",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("test", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "ABC",
                                new SourcePos("test", 1, 1),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "{ABC",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("test", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("{")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "{ABC",
                                new SourcePos("test", 1, 1),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("test", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "",
                                new SourcePos("test", 1, 1),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                // some spaces and comments
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "{- nyan\ncat -}\n \f\r\v{----}\n\tABC",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("test", 4, 9),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "ABC",
                                new SourcePos("test", 4, 9),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "{- nyan\ncat -}\n \f\r\v{----}\n\t{ABC",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("test", 4, 9),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("{")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "{ABC",
                                new SourcePos("test", 4, 9),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "{- nyan\ncat -}\n \f\r\v{----}\n\t",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("test", 4, 9),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "",
                                new SourcePos("test", 4, 9),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                // unclosed comment
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "{- nyan\ncat",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.cerr(
                            new ParseError(
                                new SourcePos("test", 2, 4),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "end of comment")
                                ]
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "{-",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.cerr(
                            new ParseError(
                                new SourcePos("test", 1, 3),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "end of comment")
                                ]
                            )
                        )
                    )).to.be.true;
                }
            }
        });

        it("should allow nested comments", () => {
            for (const def of defs) {
                const tp = makeTokenParser(def);
                const whiteSpace = tp.whiteSpace;
                assertParser(whiteSpace);
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "{-\n{- nyan\ncat -}\n-}\nABC",
                    new SourcePos("test", 1, 1),
                    "none"
                );
                const res = whiteSpace.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(
                        new ParseError(
                            new SourcePos("test", 5, 1),
                            [
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                new ErrorMessage(ErrorMessageType.EXPECT, "")
                            ]
                        ),
                        undefined,
                        new State(
                            new Config({ tabWidth: 8 }),
                            "ABC",
                            new SourcePos("test", 5, 1),
                            "none"
                        )
                    )
                )).to.be.true;
            }
        });
    });

    context("when both one-line and multi-line comments are given without allowing nested comments", () => {
        const defs = [
            new LanguageDef({
                commentLine   : "//",
                commentStart  : "/*",
                commentEnd    : "*/",
                nestedComments: false
            }),
            new LanguageDef({
                commentLine   : "//",
                commentStart  : "/*",
                commentEnd    : "*/",
                nestedComments: false
            })
        ];

        it("should skip spaces and multi-line comments", () => {
            for (const def of defs) {
                const tp = makeTokenParser(def);
                const whiteSpace = tp.whiteSpace;
                assertParser(whiteSpace);
                // no spaces and comments
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "ABC",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("test", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "ABC",
                                new SourcePos("test", 1, 1),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "/ABC",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("test", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("/")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "/ABC",
                                new SourcePos("test", 1, 1),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("test", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "",
                                new SourcePos("test", 1, 1),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                // some spaces and comments
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "/* nyan\ncat */\n \f\r\v/****/\n// foobar\n\tABC",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("test", 5, 9),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "ABC",
                                new SourcePos("test", 5, 9),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "/* nyan\ncat */\n \f\r\v/****/\n// foobar\n\t/ABC",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("test", 5, 9),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("/")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "/ABC",
                                new SourcePos("test", 5, 9),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "/* nyan\ncat */\n \f\r\v/****/\n// foobar\n\t",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("test", 5, 9),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "",
                                new SourcePos("test", 5, 9),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                // comment in the last line
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "// nyancat",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("test", 1, 11),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "",
                                new SourcePos("test", 1, 11),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "//",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("test", 1, 3),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "",
                                new SourcePos("test", 1, 3),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                // unclosed comment
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "/* nyan\ncat",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.cerr(
                            new ParseError(
                                new SourcePos("test", 2, 4),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "end of comment")
                                ]
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "/*",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.cerr(
                            new ParseError(
                                new SourcePos("test", 1, 3),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "end of comment")
                                ]
                            )
                        )
                    )).to.be.true;
                }
            }
        });

        it("should not allow nested comments", () => {
            for (const def of defs) {
                const tp = makeTokenParser(def);
                const whiteSpace = tp.whiteSpace;
                assertParser(whiteSpace);
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "/*\n/* nyan\ncat */\n*/\nABC",
                    new SourcePos("test", 1, 1),
                    "none"
                );
                const res = whiteSpace.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(
                        new ParseError(
                            new SourcePos("test", 4, 1),
                            [
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("*")),
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("*")),
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("*")),
                                new ErrorMessage(ErrorMessageType.EXPECT, "")
                            ]
                        ),
                        undefined,
                        new State(
                            new Config({ tabWidth: 8 }),
                            "*/\nABC",
                            new SourcePos("test", 4, 1),
                            "none"
                        )
                    )
                )).to.be.true;
            }
        });
    });

    context("when both one-line and multi-line comments are given with allowing nested comments", () => {
        const defs = [
            new LanguageDef({
                commentLine   : "--",
                commentStart  : "{-",
                commentEnd    : "-}",
                nestedComments: true
            }),
            new LanguageDef({
                commentLine   : "--",
                commentStart  : "{-",
                commentEnd    : "-}",
                nestedComments: true
            })
        ];

        it("should skip spaces and comments", () => {
            for (const def of defs) {
                const tp = makeTokenParser(def);
                const whiteSpace = tp.whiteSpace;
                assertParser(whiteSpace);
                // no spaces and comments
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "ABC",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("test", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "ABC",
                                new SourcePos("test", 1, 1),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "-ABC",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("test", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("-")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("-")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "-ABC",
                                new SourcePos("test", 1, 1),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "{ABC",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("test", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("{")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("{")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "{ABC",
                                new SourcePos("test", 1, 1),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("test", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "",
                                new SourcePos("test", 1, 1),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                // some spaces and comments
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "{- nyan\ncat -}\n \f\r\v{----}\n-- foobar\n\tABC",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("test", 5, 9),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "ABC",
                                new SourcePos("test", 5, 9),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "{- nyan\ncat -}\n \f\r\v{----}\n-- foobar\n\t-ABC",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("test", 5, 9),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("-")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("-")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "-ABC",
                                new SourcePos("test", 5, 9),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "{- nyan\ncat -}\n \f\r\v{----}\n-- foobar\n\t{ABC",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("test", 5, 9),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("{")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("{")),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "{ABC",
                                new SourcePos("test", 5, 9),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "{- nyan\ncat -}\n \f\r\v{----}\n-- foobar\n\t",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("test", 5, 9),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "",
                                new SourcePos("test", 5, 9),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                // comment in the last line
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "-- nyancat",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("test", 1, 11),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "",
                                new SourcePos("test", 1, 11),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "--",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("test", 1, 3),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "")
                                ]
                            ),
                            undefined,
                            new State(
                                new Config({ tabWidth: 8 }),
                                "",
                                new SourcePos("test", 1, 3),
                                "none"
                            )
                        )
                    )).to.be.true;
                }
                // unclosed comment
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "{- nyan\ncat",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.cerr(
                            new ParseError(
                                new SourcePos("test", 2, 4),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "end of comment")
                                ]
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "{-",
                        new SourcePos("test", 1, 1),
                        "none"
                    );
                    const res = whiteSpace.run(initState);
                    expect(Result.equal(
                        res,
                        Result.cerr(
                            new ParseError(
                                new SourcePos("test", 1, 3),
                                [
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                                    new ErrorMessage(ErrorMessageType.EXPECT, "end of comment")
                                ]
                            )
                        )
                    )).to.be.true;
                }
            }
        });

        it("should allow nested comments", () => {
            for (const def of defs) {
                const tp = makeTokenParser(def);
                const whiteSpace = tp.whiteSpace;
                assertParser(whiteSpace);
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "{-\n{- nyan\ncat -}\n-}\nABC",
                    new SourcePos("test", 1, 1),
                    "none"
                );
                const res = whiteSpace.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(
                        new ParseError(
                            new SourcePos("test", 5, 1),
                            [
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("A")),
                                new ErrorMessage(ErrorMessageType.EXPECT, "")
                            ]
                        ),
                        undefined,
                        new State(
                            new Config({ tabWidth: 8 }),
                            "ABC",
                            new SourcePos("test", 5, 1),
                            "none"
                        )
                    )
                )).to.be.true;
            }
        });
    });
});

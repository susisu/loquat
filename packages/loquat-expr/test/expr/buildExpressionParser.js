/*
 * loquat-expr test / expr.buildExpressionParser()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos        = _core.SourcePos;
const ErrorMessage     = _core.ErrorMessage;
const ErrorMessageType = _core.ErrorMessageType;
const ParseError       = _core.ParseError;
const Config           = _core.Config;
const State            = _core.State;
const Result           = _core.Result;
const Parser           = _core.Parser;
const assertParser     = _core.assertParser;

const OperatorType          = _expr.OperatorType;
const OperatorAssoc         = _expr.OperatorAssoc;
const Operator              = _expr.Operator;
const buildExpressionParser = _expr.buildExpressionParser;

describe(".buildExpressionParser(opTable, atom)", () => {
    function genP(chars, val) {
        const csuc = chars[0];
        const cerr = chars[1];
        const esuc = chars[2];
        const eerr = chars[3];
        return new Parser(state => {
            switch (state.input[0]) {
            case csuc:
                {
                    const newPos = state.pos.setColumn(state.pos.column + 1);
                    return Result.csuc(
                        new ParseError(
                            newPos,
                            [new ErrorMessage(ErrorMessageType.MESSAGE, "csuc")]
                        ),
                        val,
                        new State(
                            state.config,
                            state.input.substr(1),
                            newPos,
                            "some"
                        )
                    );
                }
            case cerr:
                return Result.cerr(
                    new ParseError(
                        state.pos.setColumn(state.pos.column + 1),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "cerr")]
                    )
                );
            case esuc:
                return Result.esuc(
                    new ParseError(
                        state.pos,
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "esuc")]
                    ),
                    val,
                    new State(
                        state.config,
                        state.input.substr(1),
                        state.pos,
                        "some"
                    )
                );
            case eerr:
            default:
                return Result.eerr(
                    new ParseError(
                        state.pos,
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "eerr")]
                    )
                );
            }
        });
    }
    function genInfixP(chars, symbol) {
        return genP(chars, (x, y) => `(${x}${symbol}${y})`);
    }
    function genPrefixP(chars, symbol) {
        return genP(chars, x => `(${symbol}${x})`);
    }
    function genPostfixP(chars, symbol) {
        return genP(chars, x => `(${x}${symbol})`);
    }

    function infixOp(chars, symbol) {
        return new Operator(OperatorType.INFIX, genInfixP(chars, symbol), OperatorAssoc.NONE);
    }
    function infixlOp(chars, symbol) {
        return new Operator(OperatorType.INFIX, genInfixP(chars, symbol), OperatorAssoc.LEFT);
    }
    function infixrOp(chars, symbol) {
        return new Operator(OperatorType.INFIX, genInfixP(chars, symbol), OperatorAssoc.RIGHT);
    }
    function prefixOp(chars, symbol) {
        return new Operator(OperatorType.PREFIX, genPrefixP(chars, symbol));
    }
    function postfixOp(chars, symbol) {
        return new Operator(OperatorType.POSTFIX, genPostfixP(chars, symbol));
    }

    const atom = genP("CcEe", "X");

    context("when no operators given", () => {
        const opTable = [];

        it("should return a parser that is identical to `atom'", () => {
            const parser = buildExpressionParser(opTable, atom);
            assertParser(parser);
            // csuc
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "Ce",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 2),
                            [new ErrorMessage(ErrorMessageType.MESSAGE, "csuc")]
                        ),
                        "X",
                        new State(
                            initState.config,
                            "e",
                            new SourcePos("foobar", 1, 2),
                            "some"
                        )
                    )
                )).to.be.true;
            }
            // cerr
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "ce",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.cerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 2),
                            [new ErrorMessage(ErrorMessageType.MESSAGE, "cerr")]
                        )
                    )
                )).to.be.true;
            }
            // esuc
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "Ee",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.esuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 1),
                            [new ErrorMessage(ErrorMessageType.MESSAGE, "esuc")]
                        ),
                        "X",
                        new State(
                            initState.config,
                            "e",
                            new SourcePos("foobar", 1, 1),
                            "some"
                        )
                    )
                )).to.be.true;
            }
            // eerr
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "ee",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.eerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 1),
                            [new ErrorMessage(ErrorMessageType.MESSAGE, "eerr")]
                        )
                    )
                )).to.be.true;
            }
        });
    });

    context("when a prefix operator is given", () => {
        const opTable = [
            [prefixOp("+-*/", "+")]
        ];

        it("should return an expression parser that applies the operator to value", () => {
            const parser = buildExpressionParser(opTable, atom);
            assertParser(parser);
            // csuc
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "+Ee",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 2),
                            [
                                new ErrorMessage(ErrorMessageType.MESSAGE, "csuc"), // prefix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"), // term
                                new ErrorMessage(ErrorMessageType.EXPECT, "")       // postfix
                            ]
                        ),
                        "(+X)",
                        new State(
                            initState.config,
                            "e",
                            new SourcePos("foobar", 1, 2),
                            "some"
                        )
                    )
                )).to.be.true;
            }
            // cerr
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "-Ee",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.cerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 2),
                            [
                                new ErrorMessage(ErrorMessageType.MESSAGE, "cerr") // prefix
                            ]
                        )
                    )
                )).to.be.true;
            }
            // esuc
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "*Ee",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.esuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 1),
                            [
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"), // prefix
                                new ErrorMessage(ErrorMessageType.EXPECT, ""),
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"), // term
                                new ErrorMessage(ErrorMessageType.EXPECT, "")       // postfix
                            ]
                        ),
                        "(+X)",
                        new State(
                            initState.config,
                            "e",
                            new SourcePos("foobar", 1, 1),
                            "some"
                        )
                    )
                )).to.be.true;
            }
            // eerr
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "/Ee",
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
                                new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"), // prefix
                                new ErrorMessage(ErrorMessageType.EXPECT, ""),
                                new ErrorMessage(ErrorMessageType.MESSAGE, "eerr")  // term
                            ]
                        )
                    )
                )).to.be.true;
            }
        });
    });

    context("when a postfix operator is given", () => {
        const opTable = [
            [postfixOp("+-*/", "+")]
        ];

        it("should return an expression parser that applies the operator to value", () => {
            const parser = buildExpressionParser(opTable, atom);
            assertParser(parser);
            // csuc
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "E+e",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 2),
                            [
                                new ErrorMessage(ErrorMessageType.MESSAGE, "csuc") // postfix
                            ]
                        ),
                        "(X+)",
                        new State(
                            initState.config,
                            "e",
                            new SourcePos("foobar", 1, 2),
                            "some"
                        )
                    )
                )).to.be.true;
            }
            // cerr
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "E-e",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.cerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 2),
                            [
                                new ErrorMessage(ErrorMessageType.MESSAGE, "cerr") // postfix
                            ]
                        )
                    )
                )).to.be.true;
            }
            // esuc
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "E*e",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.esuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 1),
                            [
                                new ErrorMessage(ErrorMessageType.EXPECT, ""),      // prefix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"), // term
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"), // postfix
                                new ErrorMessage(ErrorMessageType.EXPECT, "")
                            ]
                        ),
                        "(X+)",
                        new State(
                            initState.config,
                            "e",
                            new SourcePos("foobar", 1, 1),
                            "some"
                        )
                    )
                )).to.be.true;
            }
            // eerr
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "E/e",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.esuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 1),
                            [
                                new ErrorMessage(ErrorMessageType.EXPECT, ""),      // prefix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"), // term
                                new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"), // postfix
                                new ErrorMessage(ErrorMessageType.EXPECT, "")
                            ]
                        ),
                        "X",
                        new State(
                            initState.config,
                            "/e",
                            new SourcePos("foobar", 1, 1),
                            "some"
                        )
                    )
                )).to.be.true;
            }
        });
    });

    context("when a non-associative infix operator", () => {
        const opTable = [
            [infixOp("+-*/", "+")]
        ];

        it("should return an expression parser that applies the operator to operands", () => {
            const parser = buildExpressionParser(opTable, atom);
            assertParser(parser);
            // csuc
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "E+Ee",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 2),
                            [
                                new ErrorMessage(ErrorMessageType.MESSAGE, "csuc"), // infix
                                new ErrorMessage(ErrorMessageType.EXPECT, ""),      // prefix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"), // term
                                new ErrorMessage(ErrorMessageType.EXPECT, ""),      // postfix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "eerr")  // infix
                            ]
                        ),
                        "(X+X)",
                        new State(
                            initState.config,
                            "e",
                            new SourcePos("foobar", 1, 2),
                            "some"
                        )
                    )
                )).to.be.true;
            }
            // cerr
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "E-Ee",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.cerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 2),
                            [
                                new ErrorMessage(ErrorMessageType.MESSAGE, "cerr") // infix
                            ]
                        )
                    )
                )).to.be.true;
            }
            // esuc
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "E*Ee",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.esuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 1),
                            [
                                new ErrorMessage(ErrorMessageType.EXPECT, ""),        // prefix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                new ErrorMessage(ErrorMessageType.EXPECT, ""),        // postfix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixr
                                new ErrorMessage(
                                    ErrorMessageType.MESSAGE,
                                    "ambiguous use of a non associative operator"
                                ),
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixl
                                new ErrorMessage(
                                    ErrorMessageType.MESSAGE,
                                    "ambiguous use of a non associative operator"
                                ),
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infix
                                // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // prefix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // postfix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"),   // infix
                                new ErrorMessage(ErrorMessageType.EXPECT, "operator") // label
                            ]
                        ),
                        "(X+X)",
                        new State(
                            initState.config,
                            "e",
                            new SourcePos("foobar", 1, 1),
                            "some"
                        )
                    )
                )).to.be.true;
            }
            // eerr
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "E/Ee",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.esuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 1),
                            [
                                new ErrorMessage(ErrorMessageType.EXPECT, ""),        // prefix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                new ErrorMessage(ErrorMessageType.EXPECT, ""),        // postfix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"),   // infixr
                                new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"),   // infixl
                                new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"),   // infix
                                new ErrorMessage(ErrorMessageType.EXPECT, "operator") // label
                            ]
                        ),
                        "X",
                        new State(
                            initState.config,
                            "/Ee",
                            new SourcePos("foobar", 1, 1),
                            "some"
                        )
                    )
                )).to.be.true;
            }
            // multiple
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "E*E*Ee",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.esuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 1),
                            [
                                new ErrorMessage(ErrorMessageType.EXPECT, ""),        // prefix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                new ErrorMessage(ErrorMessageType.EXPECT, ""),        // postfix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixr
                                new ErrorMessage(
                                    ErrorMessageType.MESSAGE,
                                    "ambiguous use of a non associative operator"
                                ),
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixl
                                new ErrorMessage(
                                    ErrorMessageType.MESSAGE,
                                    "ambiguous use of a non associative operator"
                                ),
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infix
                                // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // prefix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // postfix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infix
                                new ErrorMessage(
                                    ErrorMessageType.MESSAGE,
                                    "ambiguous use of a non associative operator"
                                ),
                                new ErrorMessage(ErrorMessageType.EXPECT, "operator") // label
                            ]
                        ),
                        "(X+X)",
                        new State(
                            initState.config,
                            "*Ee",
                            new SourcePos("foobar", 1, 1),
                            "some"
                        )
                    )
                )).to.be.true;
            }
        });
    });

    context("when a left-associative infix operator is given", () => {
        const opTable = [
            [infixlOp("+-*/", "+")]
        ];

        it("should return an expression parser that applies the operator to operands", () => {
            const parser = buildExpressionParser(opTable, atom);
            assertParser(parser);
            // 1 operator
            {
                // csuc
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E+Ee",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("foobar", 1, 2),
                                [
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "csuc"), // infixl
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),      // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"), // term
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),      // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "eerr")  // infixl
                                ]
                            ),
                            "(X+X)",
                            new State(
                                initState.config,
                                "e",
                                new SourcePos("foobar", 1, 2),
                                "some"
                            )
                        )
                    )).to.be.true;
                }
                // cerr
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E-Ee",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.cerr(
                            new ParseError(
                                new SourcePos("foobar", 1, 2),
                                [
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "cerr") // infixl
                                ]
                            )
                        )
                    )).to.be.true;
                }
                // esuc
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E*Ee",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("foobar", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),        // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),        // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixr
                                    new ErrorMessage(
                                        ErrorMessageType.MESSAGE,
                                        "ambiguous use of a left associative operator"
                                    ),
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixl
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"),   // infixl
                                    new ErrorMessage(ErrorMessageType.EXPECT, "operator") // label
                                ]
                            ),
                            "(X+X)",
                            new State(
                                initState.config,
                                "e",
                                new SourcePos("foobar", 1, 1),
                                "some"
                            )
                        )
                    )).to.be.true;
                }
                // eerr
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E/Ee",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("foobar", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),        // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),        // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"),   // infixl
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"),   // infixr
                                    new ErrorMessage(ErrorMessageType.EXPECT, "operator") // label
                                ]
                            ),
                            "X",
                            new State(
                                initState.config,
                                "/Ee",
                                new SourcePos("foobar", 1, 1),
                                "some"
                            )
                        )
                    )).to.be.true;
                }
            }
            // 2 operators
            {
                // csuc
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E*E+Ce",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("foobar", 1, 3),
                                [
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "csuc"), // term
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),      // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "eerr")  // infixl
                                ]
                            ),
                            "((X+X)+X)",
                            new State(
                                initState.config,
                                "e",
                                new SourcePos("foobar", 1, 3),
                                "some"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E*E+ce",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.cerr(
                            new ParseError(
                                new SourcePos("foobar", 1, 3),
                                [
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "cerr") // term
                                ]
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E*E+Ee",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("foobar", 1, 2),
                                [
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "csuc"), // infixl
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),      // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"), // term
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),      // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "eerr")  // infixl
                                ]
                            ),
                            "((X+X)+X)",
                            new State(
                                initState.config,
                                "e",
                                new SourcePos("foobar", 1, 2),
                                "some"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E*E+ee",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.cerr(
                            new ParseError(
                                new SourcePos("foobar", 1, 2),
                                [
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "csuc"), // infixl
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),      // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "eerr")  // term
                                ]
                            )
                        )
                    )).to.be.true;
                }
                // cerr
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E*E-Ee",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.cerr(
                            new ParseError(
                                new SourcePos("foobar", 1, 2),
                                [
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "cerr") // infixl
                                ]
                            )
                        )
                    )).to.be.true;
                }
                // esuc
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E*E*Ce",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("foobar", 1, 2),
                                [
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "csuc"), // term
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),      // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "eerr")  // infixl
                                ]
                            ),
                            "((X+X)+X)",
                            new State(
                                initState.config,
                                "e",
                                new SourcePos("foobar", 1, 2),
                                "some"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E*E*ce",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.cerr(
                            new ParseError(
                                new SourcePos("foobar", 1, 2),
                                [
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "cerr") // term
                                ]
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E*E*Ee",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("foobar", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),        // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),        // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixr
                                    new ErrorMessage(
                                        ErrorMessageType.MESSAGE,
                                        "ambiguous use of a left associative operator"
                                    ),
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixl
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixl
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"),   // infixl
                                    new ErrorMessage(ErrorMessageType.EXPECT, "operator") // label
                                ]
                            ),
                            "((X+X)+X)",
                            new State(
                                initState.config,
                                "e",
                                new SourcePos("foobar", 1, 1),
                                "some"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E*E*ee",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("foobar", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),        // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),        // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixr
                                    new ErrorMessage(
                                        ErrorMessageType.MESSAGE,
                                        "ambiguous use of a left associative operator"
                                    ),
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixl
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixl
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"),   // term
                                    new ErrorMessage(ErrorMessageType.EXPECT, "operator") // label
                                ]
                            ),
                            "(X+X)",
                            new State(
                                initState.config,
                                "*ee",
                                new SourcePos("foobar", 1, 1),
                                "some"
                            )
                        )
                    )).to.be.true;
                }
                // eerr
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E*E/Ee",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("foobar", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),        // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),        // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixr
                                    new ErrorMessage(
                                        ErrorMessageType.MESSAGE,
                                        "ambiguous use of a left associative operator"
                                    ),
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixl
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"),   // infixl
                                    new ErrorMessage(ErrorMessageType.EXPECT, "operator") // label
                                ]
                            ),
                            "(X+X)",
                            new State(
                                initState.config,
                                "/Ee",
                                new SourcePos("foobar", 1, 1),
                                "some"
                            )
                        )
                    )).to.be.true;
                }
            }
            // 3 operators
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "E*E+E*ee",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 2),
                            [
                                new ErrorMessage(ErrorMessageType.MESSAGE, "csuc"), // infixl
                                new ErrorMessage(ErrorMessageType.EXPECT, ""),      // prefix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"), // term
                                new ErrorMessage(ErrorMessageType.EXPECT, ""),      // postfix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"), // infixl
                                new ErrorMessage(ErrorMessageType.EXPECT, ""),      // prefix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "eerr")  // term
                            ]
                        ),
                        "((X+X)+X)",
                        new State(
                            initState.config,
                            "*ee",
                            new SourcePos("foobar", 1, 2),
                            "some"
                        )
                    )
                )).to.be.true;
            }
        });
    });

    context("when a right-associative infix operator is given", () => {
        const opTable = [
            [infixrOp("+-*/", "+")]
        ];

        it("should return an expression parser that applies the operator to operands", () => {
            const parser = buildExpressionParser(opTable, atom);
            assertParser(parser);
            // 1 operator
            {
                // csuc
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E+Ee",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("foobar", 1, 2),
                                [
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "csuc"), // infixr
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),      // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"), // term
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),      // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "eerr")  // infixr
                                ]
                            ),
                            "(X+X)",
                            new State(
                                initState.config,
                                "e",
                                new SourcePos("foobar", 1, 2),
                                "some"
                            )
                        )
                    )).to.be.true;
                }
                // cerr
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E-Ee",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.cerr(
                            new ParseError(
                                new SourcePos("foobar", 1, 2),
                                [
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "cerr") // infixr
                                ]
                            )
                        )
                    )).to.be.true;
                }
                // esuc
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E*Ee",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("foobar", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),        // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),        // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixr
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"),   // infixr
                                    new ErrorMessage(ErrorMessageType.EXPECT, "operator") // label
                                ]
                            ),
                            "(X+X)",
                            new State(
                                initState.config,
                                "e",
                                new SourcePos("foobar", 1, 1),
                                "some"
                            )
                        )
                    )).to.be.true;
                }
                // eerr
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E/Ee",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("foobar", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),        // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),        // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"),   // infixr
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"),   // infixl
                                    new ErrorMessage(ErrorMessageType.EXPECT, "operator") // label
                                ]
                            ),
                            "X",
                            new State(
                                initState.config,
                                "/Ee",
                                new SourcePos("foobar", 1, 1),
                                "some"
                            )
                        )
                    )).to.be.true;
                }
            }
            // 2 operators
            {
                // csuc
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E*E+Ce",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("foobar", 1, 3),
                                [
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "csuc"), // term
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),      // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "eerr")  // infixr
                                ]
                            ),
                            "(X+(X+X))",
                            new State(
                                initState.config,
                                "e",
                                new SourcePos("foobar", 1, 3),
                                "some"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E*E+ce",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.cerr(
                            new ParseError(
                                new SourcePos("foobar", 1, 3),
                                [
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "cerr") // term
                                ]
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E*E+Ee",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("foobar", 1, 2),
                                [
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "csuc"), // infixr
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),      // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"), // term
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),      // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "eerr")  // infixr
                                ]
                            ),
                            "(X+(X+X))",
                            new State(
                                initState.config,
                                "e",
                                new SourcePos("foobar", 1, 2),
                                "some"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E*E+ee",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.cerr(
                            new ParseError(
                                new SourcePos("foobar", 1, 2),
                                [
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "csuc"), // infixr
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),      // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "eerr")  // term
                                ]
                            )
                        )
                    )).to.be.true;
                }
                // cerr
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E*E-Ee",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.cerr(
                            new ParseError(
                                new SourcePos("foobar", 1, 2),
                                [
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "cerr") // infixr
                                ]
                            )
                        )
                    )).to.be.true;
                }
                // esuc
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E*E*Ce",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("foobar", 1, 2),
                                [
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "csuc"), // term
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),      // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "eerr")  // infixr
                                ]
                            ),
                            "(X+(X+X))",
                            new State(
                                initState.config,
                                "e",
                                new SourcePos("foobar", 1, 2),
                                "some"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E*E*ce",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.cerr(
                            new ParseError(
                                new SourcePos("foobar", 1, 2),
                                [
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "cerr") // term
                                ]
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E*E*Ee",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("foobar", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),        // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),        // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixr
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixr
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"),   // infixr
                                    new ErrorMessage(ErrorMessageType.EXPECT, "operator") // label
                                ]
                            ),
                            "(X+(X+X))",
                            new State(
                                initState.config,
                                "e",
                                new SourcePos("foobar", 1, 1),
                                "some"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E*E*ee",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("foobar", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),        // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),        // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixr
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixr
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"),   // term
                                    new ErrorMessage(ErrorMessageType.EXPECT, "operator") // label
                                ]
                            ),
                            "(X+X)",
                            new State(
                                initState.config,
                                "*ee",
                                new SourcePos("foobar", 1, 1),
                                "some"
                            )
                        )
                    )).to.be.true;
                }
            }
            // 3 operators
            {
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E*E*E*Ee",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.esuc(
                            new ParseError(
                                new SourcePos("foobar", 1, 1),
                                [
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),        // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),        // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixr
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixr
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixr
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                    // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"),   // infixr
                                    new ErrorMessage(ErrorMessageType.EXPECT, "operator") // label
                                ]
                            ),
                            "(X+(X+(X+X)))",
                            new State(
                                initState.config,
                                "e",
                                new SourcePos("foobar", 1, 1),
                                "some"
                            )
                        )
                    )).to.be.true;
                }
                {
                    const initState = new State(
                        new Config({ tabWidth: 8 }),
                        "E*E+E*ee",
                        new SourcePos("foobar", 1, 1),
                        "none"
                    );
                    const res = parser.run(initState);
                    expect(Result.equal(
                        res,
                        Result.csuc(
                            new ParseError(
                                new SourcePos("foobar", 1, 2),
                                [
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "csuc"), // infixr
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),      // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"), // term
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),      // postfix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"), // infixr
                                    new ErrorMessage(ErrorMessageType.EXPECT, ""),      // prefix
                                    new ErrorMessage(ErrorMessageType.MESSAGE, "eerr")  // term
                                ]
                            ),
                            "(X+(X+X))",
                            new State(
                                initState.config,
                                "*ee",
                                new SourcePos("foobar", 1, 2),
                                "some"
                            )
                        )
                    )).to.be.true;
                }
            }
            // 4 operators
            {
                const initState = new State(
                    new Config({ tabWidth: 8 }),
                    "E*E*E*E*ee",
                    new SourcePos("foobar", 1, 1),
                    "none"
                );
                const res = parser.run(initState);
                expect(Result.equal(
                    res,
                    Result.esuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 1),
                            [
                                new ErrorMessage(ErrorMessageType.EXPECT, ""),        // prefix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                new ErrorMessage(ErrorMessageType.EXPECT, ""),        // postfix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixr
                                // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // prefix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // postfix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixr
                                // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // prefix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // postfix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixr
                                // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // prefix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // term
                                // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // postfix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),   // infixr
                                // new ErrorMessage(ErrorMessageType.EXPECT, ""),     // prefix
                                new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"),   // term
                                new ErrorMessage(ErrorMessageType.EXPECT, "operator") // label
                            ]
                        ),
                        "(X+(X+(X+X)))",
                        new State(
                            initState.config,
                            "*ee",
                            new SourcePos("foobar", 1, 1),
                            "some"
                        )
                    )
                )).to.be.true;
            }
        });
    });

    context("when two infix operators are given in single precedence", () => {
        const opTable = [
            [
                infixrOp("|o&a", "|"),
                infixlOp("+-*/", "+")
            ]
        ];

        it("should return an expression parser that does not parse operators hierarchically", () => {
            const parser = buildExpressionParser(opTable, atom);
            assertParser(parser);
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "E*E&Ee",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.EXPECT, ""),         // prefix
                            new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),    // term
                            new ErrorMessage(ErrorMessageType.EXPECT, ""),         // postfix
                            new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"),    // infixr
                            new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),
                            new ErrorMessage(
                                ErrorMessageType.MESSAGE,
                                "ambiguous use of a left associative operator"
                            ),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),    // infixl
                            // new ErrorMessage(ErrorMessageType.EXPECT, ""),      // prefix
                            new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),    // term
                            // new ErrorMessage(ErrorMessageType.EXPECT, ""),      // postfix
                            new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"),    // infixl
                            new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),    // infixr
                            new ErrorMessage(
                                ErrorMessageType.MESSAGE,
                                "ambiguous use of a right associative operator"
                            ),
                            new ErrorMessage(ErrorMessageType.EXPECT, "operator")  // label
                        ]
                    ),
                    "(X+X)",
                    new State(
                        initState.config,
                        "&Ee",
                        new SourcePos("foobar", 1, 1),
                        "some"
                    )
                )
            )).to.be.true;
        });
    });

    context("when two operators are given in different precedences", () => {
        const opTable = [
            [infixrOp("|o&a", "|")],
            [infixlOp("+-*/", "+")]
        ];

        it("should return an expression parser that parses operators hierarchically", () => {
            const parser = buildExpressionParser(opTable, atom);
            assertParser(parser);
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "E*E&Ee",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.EXPECT, ""),         // prefix
                            new ErrorMessage(ErrorMessageType.EXPECT, ""),         // prefix
                            new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),    // term
                            new ErrorMessage(ErrorMessageType.EXPECT, ""),         // postfix
                            new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"),    // infixr
                            new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"),    // infixl
                            new ErrorMessage(ErrorMessageType.EXPECT, "operator"), // label
                            new ErrorMessage(ErrorMessageType.EXPECT, ""),         // postfix
                            new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),    // infixr
                            new ErrorMessage(
                                ErrorMessageType.MESSAGE,
                                "ambiguous use of a left associative operator"
                            ),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),    // infixl
                            // new ErrorMessage(ErrorMessageType.EXPECT, ""),      // prefix
                            new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),    // term
                            // new ErrorMessage(ErrorMessageType.EXPECT, ""),      // postfix
                            new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),    // infixr
                            // new ErrorMessage(ErrorMessageType.EXPECT, ""),      // prefix
                            new ErrorMessage(ErrorMessageType.MESSAGE, "esuc"),    // term
                            // new ErrorMessage(ErrorMessageType.EXPECT, ""),      // postfix
                            new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"),    // infixr
                            new ErrorMessage(ErrorMessageType.MESSAGE, "eerr"),    // infixl
                            new ErrorMessage(ErrorMessageType.EXPECT, "operator")  // label
                        ]
                    ),
                    "(X+(X|X))",
                    new State(
                        initState.config,
                        "e",
                        new SourcePos("foobar", 1, 1),
                        "some"
                    )
                )
            )).to.be.true;
        });
    });

    it("should throw an Error if an operator in `opTable' has unknown operator type", () => {
        const opTable = [
            [new Operator("__unknown_type__", new Parser(() => {}))]
        ];
        const atom = new Parser(() => {});
        expect(() => { buildExpressionParser(opTable, atom); }).to.throw(Error, /operator/);
    });

    it("should throw an Error if an infix operator in `opTable' has unknown operator associativity", () => {
        const opTable = [
            [new Operator(OperatorType.INFIX, new Parser(() => {}), "__unknown_assoc__")]
        ];
        const atom = new Parser(() => {});
        expect(() => { buildExpressionParser(opTable, atom); }).to.throw(Error, /operator/);
    });
});

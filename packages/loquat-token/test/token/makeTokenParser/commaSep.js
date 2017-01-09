/*
 * loquat-token test / token.makeTokenParser().commaSep()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const show             = _core.show;
const uncons           = _core.uncons;
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

const p = new Parser(state => {
    const u = uncons(state.input);
    if (u.empty) {
        return Result.eerr(
            new ParseError(
                state.pos,
                [new ErrorMessage(ErrorMessageType.MESSAGE, "e")]
            )
        );
    }
    switch (u.head) {
    case "C": {
        const newPos = state.pos.addChar(u.head);
        return Result.csuc(
            new ParseError(
                newPos,
                [new ErrorMessage(ErrorMessageType.MESSAGE, "C")]
            ),
            u.head,
            new State(
                state.config,
                u.tail,
                newPos,
                state.userState
            )
        );
    }
    case "c": {
        const newPos = state.pos.addChar(u.head);
        return Result.cerr(
            new ParseError(
                newPos,
                [new ErrorMessage(ErrorMessageType.MESSAGE, "c")]
            )
        );
    }
    case "E":
        return Result.esuc(
            new ParseError(
                state.pos,
                [new ErrorMessage(ErrorMessageType.MESSAGE, "E")]
            ),
            u.head,
            new State(
                state.config,
                u.tail,
                state.pos,
                state.userState
            )
        );
    case "e":
    default:
        return Result.eerr(
            new ParseError(
                state.pos,
                [new ErrorMessage(ErrorMessageType.MESSAGE, "e")]
            )
        );
    }
});

const arrayEqual = (xs, ys) => xs.length === ys.length && xs.every((x, i) => x === ys[i]);

describe(".commaSep(parser)", () => {
    it("should return a parser that parses zero or more tokens separated by commas", () => {
        const def = new LanguageDef({});
        const tp = makeTokenParser(def);
        const commaSep = tp.commaSep;
        expect(commaSep).to.be.a("function");
        const parser = commaSep(p);
        assertParser(parser);
        // empty
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "X",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "e")]
                    ),
                    [],
                    initState
                ),
                arrayEqual
            )).to.be.true;
        }
        // many
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "C, C, CX",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 8),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, show(","))
                        ]
                    ),
                    ["C", "C", "C"],
                    new State(
                        new Config({ tabWidth: 8 }),
                        "X",
                        new SourcePos("foobar", 1, 8),
                        "none"
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "C, C, C, X",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 10),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("X")),
                            new ErrorMessage(ErrorMessageType.EXPECT, ""),
                            new ErrorMessage(ErrorMessageType.MESSAGE, "e")
                        ]
                    )
                ),
                arrayEqual
            )).to.be.true;
        }
    });
});

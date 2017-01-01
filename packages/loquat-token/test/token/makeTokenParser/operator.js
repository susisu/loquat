/*
 * loquat-token test / token.makeTokenParser().operator
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

const opStart = genCharParser(/[\+\-\*\/\%=<>]/);
const opLetter = genCharParser(/[\+\-\*\/\%=<>\:]/);

describe(".operator", () => {
    it("should parse an operator", () => {
        const def = new LanguageDef({
            opStart      : opStart,
            opLetter     : opLetter,
            caseSensitive: true
        });
        const tp = makeTokenParser(def);
        const operator = tp.operator;
        assertParser(operator);
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "+: XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = operator.run(initState);
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
                    "+:",
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
                ":+ XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = operator.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "e"),
                            new ErrorMessage(ErrorMessageType.EXPECT, "operator")
                        ]
                    )
                )
            )).to.be.true;
        }
    });

    it("should not accept reserved operator", () => {
        {
            const def = new LanguageDef({
                opStart      : opStart,
                opLetter     : opLetter,
                reservedOps  : [],
                caseSensitive: true
            });
            const tp = makeTokenParser(def);
            const operator = tp.operator;
            assertParser(operator);
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "-> XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = operator.run(initState);
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
                    "->",
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
            const def = new LanguageDef({
                opStart      : opStart,
                opLetter     : opLetter,
                reservedOps  : ["=", "->", "<-"],
                caseSensitive: true
            });
            const tp = makeTokenParser(def);
            const operator = tp.operator;
            assertParser(operator);
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "-> XYZ",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = operator.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 3),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "e"),
                            new ErrorMessage(ErrorMessageType.UNEXPECT, "reserved operator " + show("->"))
                        ]
                    )
                )
            )).to.be.true;
        }
    });
});

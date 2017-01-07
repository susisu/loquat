/*
 * loquat-combinators test / combinators.notFollowedBy()
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

const notFollowedBy = _combinators.notFollowedBy;

describe(".notFollowedBy(parser)", () => {
    it("should return a parser that succeeds without consuming input only when `parser' fails", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        const finalState = new State(
            new Config({ tabWidth: 4 }),
            "rest",
            new SourcePos("foobar", 1, 1),
            "some"
        );
        const err = new ParseError(
            new SourcePos("foobar", 1, 1),
            [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
        );
        // csuc
        {
            const p = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(err, "nyancat", finalState);
            });
            const parser = notFollowedBy(p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "test"),
                            new ErrorMessage(ErrorMessageType.UNEXPECT, show("nyancat"))
                        ]
                    )
                )
            )).to.be.true;
        }
        // cerr
        {
            const p = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(err);
            });
            const parser = notFollowedBy(p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                    ),
                    undefined,
                    initState
                )
            )).to.be.true;
        }
        // esuc
        {
            const p = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(err, "nyancat", finalState);
            });
            const parser = notFollowedBy(p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.MESSAGE, "test"),
                            new ErrorMessage(ErrorMessageType.UNEXPECT, show("nyancat"))
                        ]
                    )
                )
            )).to.be.true;
        }
        // eerr
        {
            const p = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(err);
            });
            const parser = notFollowedBy(p);
            assertParser(parser);
            const res = parser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
                    ),
                    undefined,
                    initState
                )
            )).to.be.true;
        }
    });
});

/*
 * loquat-prim test / prim.hidden()
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const SourcePos        = _core.SourcePos;
const ErrorMessageType = _core.ErrorMessageType;
const ErrorMessage     = _core.ErrorMessage;
const ParseError       = _core.ParseError;
const Config           = _core.Config;
const State            = _core.State;
const Result           = _core.Result;
const Parser           = _core.Parser;
const assertParser     = _core.assertParser;

const hidden = _prim.hidden;

describe(".hidden(parser)", () => {
    it("should return a labelled parser with empty string", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        const finalState = new State(
            new Config({ tabWidth: 4 }),
            "rest",
            new SourcePos("foobar", 1, 2),
            "some"
        );
        // unknown error case
        {
            const err = ParseError.unknown(new SourcePos("foobar", 1, 2));
            {
                const parser = new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.csuc(err, "nyancat", finalState);
                });
                const labeled = hidden(parser);
                assertParser(labeled);
                const res = labeled.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(err, "nyancat", finalState)
                )).to.be.true;
            }
            {
                const parser = new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.cerr(err);
                });
                const labeled = hidden(parser);
                assertParser(labeled);
                const res = labeled.run(initState);
                expect(Result.equal(
                    res,
                    Result.cerr(err)
                )).to.be.true;
            }
            {
                const parser = new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.esuc(err, "nyancat", finalState);
                });
                const labeled = hidden(parser);
                assertParser(labeled);
                const res = labeled.run(initState);
                expect(Result.equal(
                    res,
                    Result.esuc(err, "nyancat", finalState)
                )).to.be.true;
            }
            {
                const parser = new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.eerr(err);
                });
                const labeled = hidden(parser);
                assertParser(labeled);
                const res = labeled.run(initState);
                expect(Result.equal(
                    res,
                    Result.eerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 2),
                            [new ErrorMessage(ErrorMessageType.EXPECT, "")]
                        )
                    )
                )).to.be.true;
            }
        }
        // known error case
        {
            const err = new ParseError(
                new SourcePos("foobar", 1, 2),
                [
                    new ErrorMessage(ErrorMessageType.EXPECT, "expect1"),
                    new ErrorMessage(ErrorMessageType.MESSAGE, "test"),
                    new ErrorMessage(ErrorMessageType.EXPECT, "expect2")
                ]
            );
            {
                const parser = new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.csuc(err, "nyancat", finalState);
                });
                const labeled = hidden(parser);
                assertParser(labeled);
                const res = labeled.run(initState);
                expect(Result.equal(
                    res,
                    Result.csuc(err, "nyancat", finalState)
                )).to.be.true;
            }
            {
                const parser = new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.cerr(err);
                });
                const labeled = hidden(parser);
                assertParser(labeled);
                const res = labeled.run(initState);
                expect(Result.equal(
                    res,
                    Result.cerr(err)
                )).to.be.true;
            }
            {
                const parser = new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.esuc(err, "nyancat", finalState);
                });
                const labeled = hidden(parser);
                assertParser(labeled);
                const res = labeled.run(initState);
                expect(Result.equal(
                    res,
                    Result.esuc(
                        new ParseError(
                            new SourcePos("foobar", 1, 2),
                            [
                                new ErrorMessage(ErrorMessageType.MESSAGE, "test"),
                                new ErrorMessage(ErrorMessageType.EXPECT, "")
                            ]
                        ),
                        "nyancat",
                        finalState
                    )
                )).to.be.true;
            }
            {
                const parser = new Parser(state => {
                    expect(State.equal(state, initState)).to.be.true;
                    return Result.eerr(err);
                });
                const labeled = hidden(parser);
                assertParser(labeled);
                const res = labeled.run(initState);
                expect(Result.equal(
                    res,
                    Result.eerr(
                        new ParseError(
                            new SourcePos("foobar", 1, 2),
                            [
                                new ErrorMessage(ErrorMessageType.MESSAGE, "test"),
                                new ErrorMessage(ErrorMessageType.EXPECT, "")
                            ]
                        )
                    )
                )).to.be.true;
            }
        }
    });
});

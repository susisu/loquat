/*
 * loquat-monad test / monad.discard()
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

const discard = _monad.discard;

describe(".discard(parser)", () => {
    it("should return a parser that runs `parser' and discards the resultant value", () => {
        const initState = new State(
            new Config({ tabWidth: 8 }),
            "input",
            new SourcePos("foobar", 1, 1),
            "none"
        );
        // csuc
        {
            const finalState = new State(
                new Config({ tabWidth: 8 }),
                "rest",
                new SourcePos("foobar", 1, 2),
                "some"
            );
            const err = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
            );
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.csuc(err, "nyancat", finalState);
            });
            const voidParser = discard(parser);
            assertParser(voidParser);
            const res = voidParser.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(err, undefined, finalState)
            )).to.be.true;
        }
        // cerr
        {
            const err = new ParseError(
                new SourcePos("foobar", 1, 2),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
            );
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.cerr(err);
            });
            const voidParser = discard(parser);
            assertParser(voidParser);
            const res = voidParser.run(initState);
            expect(Result.equal(
                res,
                Result.cerr(err)
            )).to.be.true;
        }
        // esuc
        {
            const finalState = new State(
                new Config({ tabWidth: 8 }),
                "rest",
                new SourcePos("foobar", 1, 1),
                "some"
            );
            const err = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
            );
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.esuc(err, "nyancat", finalState);
            });
            const voidParser = discard(parser);
            assertParser(voidParser);
            const res = voidParser.run(initState);
            expect(Result.equal(
                res,
                Result.esuc(err, undefined, finalState)
            )).to.be.true;
        }
        // eerr
        {
            const err = new ParseError(
                new SourcePos("foobar", 1, 1),
                [new ErrorMessage(ErrorMessageType.MESSAGE, "test")]
            );
            const parser = new Parser(state => {
                expect(State.equal(state, initState)).to.be.true;
                return Result.eerr(err);
            });
            const voidParser = discard(parser);
            assertParser(voidParser);
            const res = voidParser.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(err)
            )).to.be.true;
        }
    });
});
